import { Tool } from "./constants";
import { BrushData, renderBrush } from "./tools/brush/renderer";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { BackgroundData, renderBackground } from "./tools/background/renderer";

export type EntityData<T extends Tool> = T extends Tool.BRUSH
  ? BrushData
  : T extends Tool.BACKGROUND
  ? BackgroundData
  : never;

export type RenderEntity<T extends Tool> = {
  id: string;
  tool: T;
  data?: EntityData<T>;
};

export class Renderer {
  private renderMap = new Map<
    string,
    RenderEntity<Tool.BRUSH | Tool.BACKGROUND>
  >();
  private entityChangeListeners = new Map<string, (() => void)[]>();
  private changeListeners = [];
  private currentEntityId: string;

  add(tool: Tool, data?: EntityData<typeof tool>) {
    const id: string = uuid();
    const entity = { id, tool, data };
    this.renderMap.set(id, entity);
    this.entityChangeListeners.set(entity.id, []);
    this.emitChange(entity.id);
    this.currentEntityId = id;
    return id;
  }

  update<T extends Tool>(id: string, data: EntityData<T>) {
    const entity = this.getEntity(id);
    const updatedEntity = { ...entity };
    updatedEntity.data = { ...updatedEntity.data, ...data };
    this.renderMap.set(id, updatedEntity);
    this.emitChange(id);
  }

  onChange(listener) {
    this.changeListeners.push(listener);
    return () => {
      this.changeListeners = this.changeListeners.filter(
        (item) => item !== listener
      );
    };
  }

  onEntityChange(entityId: string, handler: () => void) {
    this.entityChangeListeners.set(entityId, [
      ...(this.entityChangeListeners.get(entityId) || []),
      handler,
    ]);
    return () => {
      this.entityChangeListeners.set(
        entityId,
        this.entityChangeListeners.get(entityId).filter((fn) => fn !== handler)
      );
    };
  }

  emitChange(id?: string) {
    if (id) {
      this.entityChangeListeners.get(id).forEach((fn) => fn());
    }
    this.changeListeners.forEach((fn) => fn());
  }

  getEntity<T extends Tool>(id: string): RenderEntity<T> {
    return this.renderMap.get(id) as RenderEntity<T>;
  }

  getEntities() {
    return Array.from(this.renderMap.values());
  }

  getCurrentEntity() {
    return this.getEntity(this.currentEntityId);
  }

  render({
    canvas,
    multiplier,
  }: {
    canvas: HTMLCanvasElement;
    multiplier: number;
  }) {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    const renderMap = {
      [Tool.BRUSH]: renderBrush,
      [Tool.BACKGROUND]: renderBackground,
    };
    this.renderMap.forEach((entity) => {
      renderMap[entity.tool] &&
        renderMap[entity.tool]({ data: entity.data, canvas, multiplier });
    });
  }
}

export const useEntityData = <T extends Tool>(
  renderer: Renderer,
  entityId: string
): [
  EntityData<T>,
  (newData: (data: EntityData<T>) => EntityData<T>) => void
] => {
  const [entity, setEntity] = useState(renderer.getEntity<T>(entityId));
  useEffect(() => {
    return renderer.onEntityChange(entityId, () => {
      setEntity(renderer.getEntity(entityId));
    });
  }, [renderer, entityId, setEntity]);
  const setEntityData = useCallback(
    (newData: (data: EntityData<T>) => EntityData<T>) => {
      const entity = renderer.getEntity<T>(entityId);
      if (typeof newData === "function") {
        renderer.update<T>(entityId, newData(entity.data));
      }
    },
    [entityId]
  );
  return [entity ? entity.data: undefined, setEntityData];
};

export const useEntities = (renderer: Renderer) => {
  const [entities, setEntities] = useState(renderer.getEntities());
  useEffect(() => {
    return renderer.onChange(() => {
      setEntities(renderer.getEntities());
    });
  }, [renderer]);

  return entities;
};

export const useCurrentEntity = (renderer: Renderer) => {
  const [entity, setEntity] = useState(renderer.getCurrentEntity());
  useEffect(() => {
    return renderer.onChange(() => {
      setEntity(renderer.getCurrentEntity());
    });
  }, [renderer]);

  return entity;
};
