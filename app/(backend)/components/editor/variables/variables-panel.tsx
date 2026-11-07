'use client';

import { useState, useTransition } from 'react';

import {
  EDITOR_VARIABLE_TYPES,
  isBaseEditorVariable,
  type EditorVariable,
  type EditorVariableType,
} from '@/core/editor-variables/editor-variables.types';
import { Button } from '@/components/ui/button';
import { ColorControl } from '@/components/ui/color-control';
import { Group } from '@/components/ui/group';
import * as Icon from '@/components/ui/icons';
import { IconValueInput } from '@/components/ui/input';
import { saveEditorVariablesAction } from './actions';

export function VariablesPanel({
  filterText,
  variables,
  onChange,
}: {
  filterText: string;
  variables: EditorVariable[];
  onChange: (variables: EditorVariable[]) => void;
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [saveError, setSaveError] = useState('');
  const [draft, setDraft] = useState<Omit<EditorVariable, 'id'>>({
    key: '',
    value: '',
    type: 'color',
  });

  const query = filterText.trim().toLowerCase();
  const filteredVariables = query
    ? variables.filter((variable) =>
      `${variable.key} ${variable.value} ${getVariableTypeLabel(variable.type)}`
        .toLowerCase()
        .includes(query)
    )
    : variables;
  const normalizedDraftKey = normalizeVariableKey(draft.key);
  const editingVariable = variables.find((variable) => variable.id === editingId);
  const editingBaseVariable = editingVariable && isBaseEditorVariable(editingVariable.key);
  const keyAlreadyExists = variables.some(
    (variable) =>
      variable.id !== editingId && normalizeVariableKey(variable.key) === normalizedDraftKey
  );
  const canSave = Boolean(normalizedDraftKey && draft.value.trim()) && !/[;{}]/.test(draft.value) && !keyAlreadyExists;

  function resetDraft() {
    setEditingId(null);
    setDraft({ key: '', value: '', type: 'color' });
  }

  function persistVariables(nextVariables: EditorVariable[]) {
    setSaveError('');
    startSaving(async () => {
      try {
        await saveEditorVariablesAction(nextVariables);
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : 'No se pudieron guardar las variables.');
      }
    });
  }

  function saveVariable() {
    if (!canSave) return;
    const nextVariable = {
      ...draft,
      key: editingBaseVariable ? editingVariable.key : normalizedDraftKey,
      type: editingBaseVariable ? editingVariable.type : draft.type,
      value: draft.value.trim(),
    };

    if (editingId) {
      const nextVariables = variables.map((variable) =>
        variable.id === editingId ? { ...variable, ...nextVariable } : variable
      );
      onChange(nextVariables);
      persistVariables(nextVariables);
      resetDraft();
      return;
    }

    const nextVariables = [
      ...variables,
      {
        id: `variable-${Date.now()}`,
        ...nextVariable,
      },
    ];
    onChange(nextVariables);
    persistVariables(nextVariables);
    setIsAddOpen(false);
    resetDraft();
  }

  function openAddForm(type: EditorVariableType) {
    setEditingId(null);
    setDraft({ key: '', value: '', type });
    setIsAddOpen(true);
  }

  function editVariable(variable: EditorVariable) {
    setEditingId(variable.id);
    setDraft({ key: variable.key, value: variable.value, type: variable.type });
    setIsAddOpen(true);
  }

  function deleteVariable(id: string) {
    if (isBaseEditorVariable(variables.find((variable) => variable.id === id)?.key ?? '')) return;
    const nextVariables = variables.filter((variable) => variable.id !== id);
    onChange(nextVariables);
    persistVariables(nextVariables);
    if (editingId === id) {
      resetDraft();
    }
  }

  return (
    <div className="p-4">
      <div className="space-y-4 border-t border-slate-100 pt-4">
        {EDITOR_VARIABLE_TYPES.map((type) => {
          const groupVariables = filteredVariables.filter((variable) => variable.type === type.value);
          const isDraftType = draft.type === type.value;
          const isFormOpen = isAddOpen && isDraftType;

          return (
            <div key={type.value} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {type.label}
                </div>
                <div className="flex flex-col">
                  {!isFormOpen && (
                    <Button
                      type="button"
                      variant="ghost"
                      buttonSize="icon"
                      aria-label={`Agregar ${type.label}`}
                      title={`Agregar ${type.label}`}
                      onClick={() => openAddForm(type.value)}
                    >
                      <Icon.PlusIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {isFormOpen && (
                    <Button
                      type="button"
                      variant="ghost"
                      buttonSize="icon"
                      aria-label="Cancelar variable"
                      title="Cancelar"
                      onClick={() => {
                        setIsAddOpen(false);
                        resetDraft();
                      }}
                    >
                      <Icon.XIcon className="h-4 w-4" />
                    </Button>
                  )}
                  {/* <span className="text-[11px] text-slate-400">{groupVariables.length}</span> */}
                </div>
              </div>

              {isFormOpen && (
                              <Group label="Alto">
                <div className="grid grid-cols-[1fr_1fr_32px] items-end gap-2">
                  <Group label="Etiqueta">
                    {editingBaseVariable ? (
                      <code className="flex h-8 items-center truncate rounded-sm border border-slate-200 bg-slate-50 px-2 text-xs text-slate-600">
                        {editingVariable.key}
                      </code>
                    ) : (
                      <IconValueInput
                        label="Etiqueta"
                        hasVariable={false}
                        icon={Icon.TagIcon}
                        value={draft.key}
                        onChange={(value) => setDraft((current) => ({ ...current, key: value }))}
                      />
                    )}
                  </Group>

                  <Group label="Valor">
                    {draft.type === 'color' ? (
                      <ColorControl
                        hasVariable={false}
                        value={draft.value}
                        onChange={(value) => setDraft((current) => ({ ...current, value }))}
                      />
                    ) : (
                      <IconValueInput
                        label="Valor"
                        icon={Icon.ExpressionIcon}
                        value={draft.value}
                        onChange={(value) => setDraft((current) => ({ ...current, value }))}
                      />
                    )}
                  </Group>

                  <Button
                    type="button"
                    title="Guardar variable"
                    variant="ghost"
                    onClick={saveVariable}
                    buttonSize="icon"
                    aria-label="Guardar variable"
                    disabled={!canSave}
                    className="h-8 w-8 p-0"
                  >
                    <Icon.SaveIcon className="h-4 w-4" />
                  </Button>
                </div>
                </Group>
              )}
              {isFormOpen && keyAlreadyExists && (
                <div className="text-[11px] text-red-500">
                  Ya existe una variable con esa etiqueta.
                </div>
              )}
              {isSaving && (
                <div className="text-[11px] text-slate-400">Guardando variables...</div>
              )}
              {saveError && <div className="text-[11px] text-red-500">{saveError}</div>}

              {groupVariables.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 px-3 py-3 text-xs text-slate-400">
                  Sin variables
                </div>
              ) : (
                <div className="space-y-2">
                  {groupVariables.map((variable) => (
                    <VariableRow
                      key={variable.id}
                      variable={variable}
                      onEdit={() => editVariable(variable)}
                      onDelete={() => deleteVariable(variable.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VariableRow({
  variable,
  onEdit,
  onDelete,
}: {
  variable: EditorVariable;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-slate-200 bg-white pl-1.5 text-xs">
      <div className="min-w-0">
        <div className="grid grid-cols-2">
          <div className="flex min-w-0 flex-row items-center gap-2">
            {variable.type === 'color' && (
              <span
                className="h-4 w-4 shrink-0 rounded-sm border border-slate-300"
                style={{ backgroundColor: variable.value }}
              />
            )}
            <code className="truncate font-medium text-slate-800">{variable.key}</code>
            {isBaseEditorVariable(variable.key) && (
              <span className="shrink-0 text-[10px] text-slate-400">Base</span>
            )}
          </div>
          <div className="mt-1 truncate text-slate-500">{variable.value}</div>
        </div>
      </div>
      <div className="flex">
        <Button
          type="button"
          variant="ghost"
          buttonSize="iconSm"
          aria-label={`Editar ${variable.key}`}
          title="Editar"
          onClick={onEdit}
        >
          <Icon.EditIcon className="h-4 w-4" />
        </Button>
        {!isBaseEditorVariable(variable.key) && (
          <Button
            type="button"
            variant="ghost"
            buttonSize="iconSm"
            aria-label={`Eliminar ${variable.key}`}
            title="Eliminar"
            onClick={onDelete}
          >
            <Icon.TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function getVariableTypeLabel(type: EditorVariableType) {
  return EDITOR_VARIABLE_TYPES.find((item) => item.value === type)?.label ?? type;
}

function normalizeVariableKey(value: string) {
  const key = value.trim().replace(/^--/, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return /^[a-z]/.test(key) ? `--${key}` : '';
}
