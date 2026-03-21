// ============================================================
// MOPIYA — Zustand Editor Store
// ============================================================

import { create } from "zustand";
import { nanoid } from "nanoid";
import type {
  EditorState,
  MopiyaNode,
  CanvasBackground,
  HistorySnapshot,
  Viewport,
  ViewportMode,
  Guide,
  CropRect
} from "@/types/editor";

// Canvas dimensions
const DESKTOP_WIDTH = 1600;
const DESKTOP_HEIGHT = 900;
const MOBILE_WIDTH = 390;
const MOBILE_HEIGHT = 844;
const MAX_HISTORY = 50;

// ── Default Background ────────────────────────────────────────

const defaultBackground: CanvasBackground = {
  type: "solid",
  color: "#0f0f14",
};

// ── Default State ─────────────────────────────────────────────

const defaultState: EditorState = {
  // Active View
  nodes: [],
  background: defaultBackground,
  canvasWidth: DESKTOP_WIDTH,
  canvasHeight: DESKTOP_HEIGHT,

  // Desktop Stash
  desktopNodes: [],
  desktopBackground: defaultBackground,
  desktopPast: [],
  desktopFuture: [],

  // Mobile Stash
  mobileNodes: [],
  mobileBackground: defaultBackground,
  mobilePast: [],
  mobileFuture: [],

  selectedIds: [],
  editingId: null,
  croppingNodeId: null,
  cropRect: null,
  viewport: {
    mode: "desktop",
    scale: 0.6,
    offsetX: 0,
    offsetY: 0,
  },
  past: [],
  future: [],
  clipboard: null,
  activePanelTab: "background",

  snapToGrid: false,
  activeGuides: [],
};

// ── Store Actions ─────────────────────────────────────────────

interface EditorActions {
  // Node CRUD
  addNode: (node: MopiyaNode) => void;
  updateNode: (id: string, patch: Partial<MopiyaNode>) => void;
  deleteNode: (id: string) => void;
  deleteSelected: () => void;
  duplicateNode: (id: string) => void;
  duplicateSelected: () => void;

  // Selection
  selectNode: (id: string, multi?: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setEditingId: (id: string | null) => void;

  // Cropping
  startCrop: (nodeId: string) => void;
  updateCropRect: (rect: CropRect) => void;
  applyCrop: () => void;
  cancelCrop: () => void;

  // Background
  setBackground: (bg: CanvasBackground) => void;
  updateBackground: (patch: Partial<CanvasBackground>) => void;

  // Viewport
  setViewportMode: (mode: ViewportMode) => void;
  setViewportScale: (scale: number) => void;
  setViewportOffset: (x: number, y: number) => void;
  setViewport: (viewport: Partial<Viewport>) => void;

  // Z-index & Layers
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  reorderLayers: (newOrderIds: string[]) => void;

  // Lock
  toggleLock: (id: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  // Clipboard
  copySelected: () => void;
  pasteClipboard: () => void;

  // Panel
  setActivePanelTab: (tab: "element" | "background" | "layers") => void;

  // Canvas
  setCanvasDimensions: (width: number, height: number) => void;

  // Guides & Grid
  toggleSnapToGrid: () => void;
  setActiveGuides: (guides: Guide[]) => void;
}

type EditorStore = EditorState & EditorActions;

// ── Helper: snapshot ─────────────────────────────────────────

function snapshot(state: EditorState): HistorySnapshot {
  return {
    nodes: JSON.parse(JSON.stringify(state.nodes)),
    background: JSON.parse(JSON.stringify(state.background)),
  };
}

// ── Helper: crop utilities ───────────────────────────────────

function clampCropRect(rect: CropRect): CropRect {
  return {
    x: Math.max(0, Math.min(1, rect.x)),
    y: Math.max(0, Math.min(1, rect.y)),
    width: Math.max(0.01, Math.min(1, rect.width)),
    height: Math.max(0.01, Math.min(1, rect.height)),
  };
}

// ── Store ─────────────────────────────────────────────────────

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...defaultState,

  // ── Add Node ─────────────────────────────────────────────

  addNode: (node) => {
    get().pushHistory();
    set((s) => ({
      nodes: [...s.nodes, node],
      selectedIds: [node.id],
      activePanelTab: "element",
    }));
  },

  // ── Update Node ──────────────────────────────────────────

  updateNode: (id, patch) => {
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? ({ ...n, ...patch } as MopiyaNode) : n
      ),
    }));
  },

  // ── Delete Node ──────────────────────────────────────────

  deleteNode: (id) => {
    get().pushHistory();
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      selectedIds: s.selectedIds.filter((sid) => sid !== id),
      editingId: s.editingId === id ? null : s.editingId,
      croppingNodeId: s.croppingNodeId === id ? null : s.croppingNodeId,
      cropRect: s.croppingNodeId === id ? null : s.cropRect,
    }));
  },

  deleteSelected: () => {
    const { selectedIds, deleteNode } = get();
    if (selectedIds.length === 0) return;
    get().pushHistory();
    set((s) => ({
      nodes: s.nodes.filter((n) => !selectedIds.includes(n.id)),
      selectedIds: [],
      editingId: null,
      croppingNodeId: s.croppingNodeId && selectedIds.includes(s.croppingNodeId) ? null : s.croppingNodeId,
      cropRect: s.croppingNodeId && selectedIds.includes(s.croppingNodeId) ? null : s.cropRect,
    }));
  },

  // ── Duplicate Node ───────────────────────────────────────

  duplicateNode: (id) => {
    const node = get().nodes.find((n) => n.id === id);
    if (!node) return;
    get().pushHistory();
    const newNode: MopiyaNode = {
      ...JSON.parse(JSON.stringify(node)),
      id: nanoid(),
      x: node.x + 20,
      y: node.y + 20,
      name: `${node.name} copy`,
    };
    set((s) => ({
      nodes: [...s.nodes, newNode],
      selectedIds: [newNode.id],
    }));
  },

  duplicateSelected: () => {
    const { selectedIds, nodes } = get();
    if (selectedIds.length === 0) return;
    get().pushHistory();
    const newNodes: MopiyaNode[] = selectedIds
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean)
      .map((node) => ({
        ...JSON.parse(JSON.stringify(node!)),
        id: nanoid(),
        x: node!.x + 20,
        y: node!.y + 20,
        name: `${node!.name} copy`,
      }));
    set((s) => ({
      nodes: [...s.nodes, ...newNodes],
      selectedIds: newNodes.map((n) => n.id),
    }));
  },

  // ── Selection ────────────────────────────────────────────

  selectNode: (id, multi = false) => {
    // If we are cropping another node, cancel it
    if (get().croppingNodeId && get().croppingNodeId !== id) {
      get().cancelCrop();
    }
    set((s) => ({
      selectedIds: multi
        ? s.selectedIds.includes(id)
          ? s.selectedIds.filter((sid) => sid !== id)
          : [...s.selectedIds, id]
        : [id],
      activePanelTab: s.activePanelTab === "background" ? "element" : s.activePanelTab,
    }));
  },

  selectAll: () => {
    set((s) => ({ selectedIds: s.nodes.map((n) => n.id) }));
  },

  clearSelection: () => {
    set({ selectedIds: [], editingId: null, activePanelTab: "background" });
  },

  setEditingId: (id) => {
    set({ editingId: id });
  },

  // ── Cropping ─────────────────────────────────────────────

  startCrop: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node || node.type !== "image") return;
    const existingCrop = (node as any).crop as CropRect | undefined;
    set({
      croppingNodeId: nodeId,
      cropRect: existingCrop ? { ...existingCrop } : { x: 0, y: 0, width: 1, height: 1 },
    });
  },

  updateCropRect: (rect) => {
    set({ cropRect: clampCropRect(rect) });
  },

  applyCrop: () => {
    const { croppingNodeId, cropRect, updateNode, pushHistory } = get();
    if (!croppingNodeId || !cropRect) return;
    pushHistory();
    updateNode(croppingNodeId, { crop: { ...cropRect } });
    set({ croppingNodeId: null, cropRect: null });
  },

  cancelCrop: () => {
    set({ croppingNodeId: null, cropRect: null });
  },

  // ── Background ───────────────────────────────────────────

  setBackground: (bg) => {
    get().pushHistory();
    set({ background: bg });
  },

  updateBackground: (patch) => {
    set((s) => ({
      background: { ...s.background, ...patch } as CanvasBackground,
    }));
  },

  // ── Viewport (Handles Mode Swapping) ─────────────────────

  setViewportMode: (mode) => {
    const width = mode === "desktop" ? DESKTOP_WIDTH : MOBILE_WIDTH;
    const height = mode === "desktop" ? DESKTOP_HEIGHT : MOBILE_HEIGHT;

    set((s) => {
      if (s.viewport.mode === mode) return {}; // Prevent redundant switching

      const isGoingToDesktop = mode === "desktop";

      const stash = s.viewport.mode === "desktop"
        ? { desktopNodes: s.nodes, desktopBackground: s.background, desktopPast: s.past, desktopFuture: s.future }
        : { mobileNodes: s.nodes, mobileBackground: s.background, mobilePast: s.past, mobileFuture: s.future };

      const load = isGoingToDesktop
        ? { nodes: s.desktopNodes, background: s.desktopBackground, past: s.desktopPast, future: s.desktopFuture }
        : { nodes: s.mobileNodes, background: s.mobileBackground, past: s.mobilePast, future: s.mobileFuture };

      return {
        ...stash,
        ...load,
        selectedIds: [],
        editingId: null,
        croppingNodeId: null,
        cropRect: null,
        viewport: { ...s.viewport, mode, scale: isGoingToDesktop ? 0.6 : 0.85 },
        canvasWidth: width,
        canvasHeight: height,
      };
    });
  },

  setViewportScale: (scale) => {
    set((s) => ({ viewport: { ...s.viewport, scale: Math.max(0.1, Math.min(3, scale)) } }));
  },

  setViewportOffset: (x, y) => {
    set((s) => ({ viewport: { ...s.viewport, offsetX: x, offsetY: y } }));
  },

  setViewport: (vp) => {
    set((s) => ({ viewport: { ...s.viewport, ...vp } }));
  },

  // ── Z-Index & Layers ─────────────────────────────────────

  bringForward: (id) => {
    set((s) => {
      const node = s.nodes.find((n) => n.id === id);
      if (!node) return {};
      const maxZ = Math.max(...s.nodes.map((n) => n.zIndex));
      return {
        nodes: s.nodes.map((n) =>
          n.id === id ? { ...n, zIndex: Math.min(n.zIndex + 1, maxZ + 1) } : n
        ),
      };
    });
  },

  sendBackward: (id) => {
    set((s) => {
      const node = s.nodes.find((n) => n.id === id);
      if (!node) return {};
      const minZ = Math.min(...s.nodes.map((n) => n.zIndex));
      return {
        nodes: s.nodes.map((n) =>
          n.id === id ? { ...n, zIndex: Math.max(n.zIndex - 1, minZ - 1) } : n
        ),
      };
    });
  },

  bringToFront: (id) => {
    set((s) => {
      const maxZ = Math.max(...s.nodes.map((n) => n.zIndex));
      return {
        nodes: s.nodes.map((n) =>
          n.id === id ? { ...n, zIndex: maxZ + 1 } : n
        ),
      };
    });
  },

  sendToBack: (id) => {
    set((s) => {
      const minZ = Math.min(...s.nodes.map((n) => n.zIndex));
      return {
        nodes: s.nodes.map((n) =>
          n.id === id ? { ...n, zIndex: minZ - 1 } : n
        ),
      };
    });
  },

  reorderLayers: (newOrderIds) => {
    set((s) => {
      const newNodes = s.nodes.map((node) => {
        const index = newOrderIds.indexOf(node.id);
        if (index !== -1) {
          return { ...node, zIndex: (newOrderIds.length - index) * 10 };
        }
        return node;
      });
      return { nodes: newNodes };
    });
  },

  // ── Lock ─────────────────────────────────────────────────

  toggleLock: (id) => {
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, locked: !n.locked } : n
      ),
    }));
  },

  // ── History ──────────────────────────────────────────────

  pushHistory: () => {
    const snap = snapshot(get());
    set((s) => ({
      past: [...s.past.slice(-MAX_HISTORY + 1), snap],
      future: [],
    }));
  },

  undo: () => {
    const { past, future, nodes, background } = get();
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    set({
      past: past.slice(0, -1),
      future: [{ nodes: JSON.parse(JSON.stringify(nodes)), background: JSON.parse(JSON.stringify(background)) }, ...future],
      nodes: prev.nodes,
      background: prev.background,
      selectedIds: [],
      croppingNodeId: null,
      cropRect: null,
    });
  },

  redo: () => {
    const { past, future, nodes, background } = get();
    if (future.length === 0) return;
    const next = future[0];
    set({
      past: [...past, { nodes: JSON.parse(JSON.stringify(nodes)), background: JSON.parse(JSON.stringify(background)) }],
      future: future.slice(1),
      nodes: next.nodes,
      background: next.background,
      selectedIds: [],
      croppingNodeId: null,
      cropRect: null,
    });
  },

  // ── Clipboard ────────────────────────────────────────────

  copySelected: () => {
    const { selectedIds, nodes } = get();
    const copied = selectedIds
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean) as MopiyaNode[];
    set({ clipboard: copied });
  },

  pasteClipboard: () => {
    const { clipboard } = get();
    if (!clipboard || clipboard.length === 0) return;
    get().pushHistory();
    const newNodes: MopiyaNode[] = clipboard.map((node) => ({
      ...JSON.parse(JSON.stringify(node)),
      id: nanoid(),
      x: node.x + 20,
      y: node.y + 20,
      name: `${node.name} copy`,
    }));
    set((s) => ({
      nodes: [...s.nodes, ...newNodes],
      selectedIds: newNodes.map((n) => n.id),
    }));
  },

  // ── Panel ────────────────────────────────────────────────

  setActivePanelTab: (tab) => set({ activePanelTab: tab }),

  // ── Canvas ───────────────────────────────────────────────

  setCanvasDimensions: (width, height) => set({ canvasWidth: width, canvasHeight: height }),

  // ── Guides & Grid ────────────────────────────────────────

  toggleSnapToGrid: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
  setActiveGuides: (guides) => set({ activeGuides: guides }),
}));

// ── Selector helpers ──────────────────────────────────────────

export const useSelectedNodes = () => {
  const nodes = useEditorStore((s) => s.nodes);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  return nodes.filter((n) => selectedIds.includes(n.id));
};

export const useSelectedNode = () => {
  const nodes = useEditorStore((s) => s.nodes);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  if (selectedIds.length !== 1) return null;
  return nodes.find((n) => n.id === selectedIds[0]) ?? null;
};

export const useNodeById = (id: string) => {
  return useEditorStore((s) => s.nodes.find((n) => n.id === id));
};

export const useCanUndo = () => useEditorStore((s) => s.past.length > 0);
export const useCanRedo = () => useEditorStore((s) => s.future.length > 0);