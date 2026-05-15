"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

type EditorBlock = {
  data?: Record<string, unknown>;
  id?: string;
  type?: string;
};

type EditorDocument = {
  blocks: EditorBlock[];
  time: number;
  version?: string;
};

type EditorInstance = {
  destroy?: () => void;
  isReady: Promise<void>;
  save: () => Promise<EditorDocument>;
};

type EditorConstructor = new (
  config: Record<string, unknown>,
) => EditorInstance;

const DEFAULT_DOCUMENT: EditorDocument = {
  blocks: [],
  time: Date.now(),
};

export function EditorJsField({
  help,
  initialValue,
  label = "Conteúdo",
  name = "content",
  placeholder = "Escreva usando blocos editoriais...",
}: {
  help?: string;
  initialValue?: unknown;
  label?: string;
  name?: string;
  placeholder?: string;
}) {
  const holderId = useId().replaceAll(":", "-");
  const editorRef = useRef<EditorInstance | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const submittingRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");
  const initialDocument = useRef(normalizeInitialValue(initialValue));

  const syncHiddenInput = useCallback(async () => {
    if (!editorRef.current || !hiddenInputRef.current) {
      return;
    }

    const document = await editorRef.current.save();
    hiddenInputRef.current.value = JSON.stringify(document);
  }, []);

  useEffect(() => {
    let disposed = false;

    async function bootEditor() {
      try {
        const [
          editorModule,
          headerModule,
          listModule,
          quoteModule,
          delimiterModule,
          imageModule,
        ] = await Promise.all([
          import("@editorjs/editorjs"),
          import("@editorjs/header"),
          import("@editorjs/list"),
          import("@editorjs/quote"),
          import("@editorjs/delimiter"),
          import("@editorjs/image"),
        ]);

        if (disposed) {
          return;
        }

        const EditorJS = editorModule.default as unknown as EditorConstructor;
        const Header = headerModule.default;
        const List = listModule.default;
        const Quote = quoteModule.default;
        const Delimiter = delimiterModule.default;
        const ImageTool = imageModule.default;

        const editor = new EditorJS({
          autofocus: false,
          data: initialDocument.current,
          holder: holderId,
          minHeight: 280,
          onChange: async () => {
            await syncHiddenInput();
          },
          i18n: editorPortugueseI18n,
          placeholder,
          tools: {
            delimiter: Delimiter,
            header: {
              class: Header,
              config: {
                defaultLevel: 2,
                levels: [2, 3, 4],
              },
              inlineToolbar: true,
            },
            list: {
              class: List,
              config: {
                defaultStyle: "unordered",
              },
              inlineToolbar: true,
            },
            image: {
              class: ImageTool,
              config: {
                captionPlaceholder: "Legenda da imagem",
                uploader: {
                  uploadByFile: uploadEditorImage,
                },
              },
            },
            quote: {
              class: Quote,
              config: {
                captionPlaceholder: "Autor ou referência",
                quotePlaceholder: "Destaque uma frase importante",
              },
              inlineToolbar: true,
            },
          },
        });

        editorRef.current = editor;
        await editor.isReady;

        if (disposed) {
          editor.destroy?.();
          return;
        }

        await syncHiddenInput();
        setIsReady(true);
      } catch {
        setError("Não foi possível carregar o editor de blocos.");
      }
    }

    void bootEditor();

    return () => {
      disposed = true;
      editorRef.current?.destroy?.();
      editorRef.current = null;
    };
  }, [holderId, syncHiddenInput]);

  useEffect(() => {
    const input = hiddenInputRef.current;
    const form = input?.form;

    if (!form) {
      return;
    }

    const handleSubmit = (event: SubmitEvent) => {
      if (submittingRef.current) {
        submittingRef.current = false;
        return;
      }

      event.preventDefault();

      void (async () => {
        await syncHiddenInput();
        submittingRef.current = true;
        form.requestSubmit();
      })();
    };

    form.addEventListener("submit", handleSubmit);

    return () => {
      form.removeEventListener("submit", handleSubmit);
    };
  }, [syncHiddenInput]);

  return (
    <div className="form-control md:col-span-2">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="label-text font-semibold">{label}</span>
        <span className="badge badge-outline text-[0.68rem]">
          Editor por blocos
        </span>
      </div>
      <input
        defaultValue={JSON.stringify(initialDocument.current)}
        name={name}
        ref={hiddenInputRef}
        type="hidden"
      />
      <div className="rounded-[1.7rem] border border-base-300 bg-base-100 p-3 shadow-inner">
        <div
          className="min-h-80 rounded-[1.35rem] bg-base-200/55 px-4 py-5 text-base-content [&_.ce-block__content]:max-w-none [&_.ce-toolbar__content]:max-w-none [&_.codex-editor]:z-0 [&_.codex-editor__redactor]:pb-8!"
          id={holderId}
        />
      </div>
      {help ? (
        <span className="label-text-alt mt-2 text-base-content/65">{help}</span>
      ) : null}
      {!isReady && !error ? (
        <span className="label-text-alt mt-2 text-base-content/55">
          Carregando editor...
        </span>
      ) : null}
      {error ? (
        <span className="label-text-alt mt-2 text-error">{error}</span>
      ) : null}
    </div>
  );
}

function normalizeInitialValue(value: unknown): EditorDocument {
  if (isEditorDocument(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) {
      return DEFAULT_DOCUMENT;
    }

    try {
      const parsed = JSON.parse(normalized) as unknown;
      if (isEditorDocument(parsed)) {
        return parsed;
      }
    } catch {
      return plainTextToDocument(normalized);
    }

    return plainTextToDocument(normalized);
  }

  return DEFAULT_DOCUMENT;
}

function isEditorDocument(value: unknown): value is EditorDocument {
  return (
    typeof value === "object" &&
    value !== null &&
    "blocks" in value &&
    Array.isArray((value as { blocks?: unknown }).blocks)
  );
}

function plainTextToDocument(value: string): EditorDocument {
  const blocks = value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((text) => ({
      data: { text },
      type: "paragraph",
    }));

  return {
    blocks,
    time: Date.now(),
  };
}

async function uploadEditorImage(file: File) {
  const signatureResponse = await fetch("/editorjs/cloudinary-signature", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ kind: "editor-image" }),
  });
  const signature = (await signatureResponse.json().catch(() => null)) as {
    api_key?: string;
    cloud_name?: string;
    folder?: string;
    max_file_size?: number;
    message?: string;
    signature?: string;
    success?: boolean;
    timestamp?: string;
    upload_url?: string;
  } | null;

  if (!signatureResponse.ok || !signature?.success) {
    throw new Error(
      signature?.message || "Não foi possível preparar o upload da imagem.",
    );
  }

  if (
    typeof signature.max_file_size === "number" &&
    file.size > signature.max_file_size
  ) {
    throw new Error("Imagem maior que o limite permitido para upload.");
  }

  const formData = new FormData();
  formData.set("file", file);
  formData.set("api_key", String(signature.api_key || ""));
  formData.set("timestamp", String(signature.timestamp || ""));
  formData.set("folder", String(signature.folder || ""));
  formData.set("signature", String(signature.signature || ""));

  const uploadResponse = await fetch(String(signature.upload_url || ""), {
    method: "POST",
    body: formData,
  });
  const uploadPayload = (await uploadResponse.json().catch(() => null)) as {
    secure_url?: string;
    url?: string;
  } | null;
  const imageUrl = uploadPayload?.secure_url || uploadPayload?.url || "";

  if (!uploadResponse.ok || !imageUrl) {
    throw new Error("Não foi possível enviar a imagem para o Cloudinary.");
  }

  return {
    success: 1,
    file: {
      url: imageUrl,
    },
  };
}

const editorPortugueseI18n = {
  messages: {
    blockTunes: {
      delete: {
        Delete: "Excluir",
      },
      moveDown: {
        "Move down": "Mover para baixo",
      },
      moveUp: {
        "Move up": "Mover para cima",
      },
    },
    toolNames: {
      Delimiter: "Separador",
      Heading: "Título",
      Image: "Imagem",
      List: "Lista",
      Quote: "Citação",
      Text: "Texto",
    },
    tools: {
      image: {
        Caption: "Legenda",
        "Select an Image": "Selecionar imagem",
        "With background": "Com fundo",
        "With border": "Com borda",
        "Stretch image": "Esticar imagem",
      },
      link: {
        "Add a link": "Adicionar link",
      },
      list: {
        Ordered: "Ordenada",
        Unordered: "Com marcadores",
      },
      quote: {
        "Align Center": "Centralizar",
        "Align Left": "Alinhar à esquerda",
      },
    },
    ui: {
      blockTunes: {
        toggler: {
          "Click to tune": "Clique para ajustar",
          "or drag to move": "ou arraste para mover",
        },
      },
      inlineToolbar: {
        converter: {
          "Convert to": "Converter para",
        },
      },
      toolbar: {
        toolbox: {
          Add: "Adicionar",
        },
      },
    },
  },
};
