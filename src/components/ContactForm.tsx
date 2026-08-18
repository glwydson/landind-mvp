import { useRef, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;
const ACCEPTED = [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".doc", ".docx"];

type FormState = {
  name: string;
  age: string;
  cpf: string;
  phone: string;
  email: string;
};

type Errors = Partial<Record<keyof FormState | "files", string>>;

type Status = { kind: "ok" | "err"; message: string } | null;

const initial: FormState = { name: "", age: "", cpf: "", phone: "", email: "" };

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10) check = 0;
  return check === Number(cpf[10]);
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function setField(field: keyof FormState, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleFiles(list: FileList | null) {
    const next = list ? Array.from(list) : [];
    const oversize = next.some((f) => f.size > MAX_FILE_SIZE);
    setFiles(next);
    setErrors((prev) => ({
      ...prev,
      files: oversize
        ? "Cada documento deve ter no máximo 10 MB."
        : next.length > MAX_FILES
          ? `Envie no máximo ${MAX_FILES} documentos.`
          : undefined,
    }));
    setStatus(null);
  }

  function validate(): boolean {
    const next: Errors = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (values.name.trim().length < 3) next.name = "Informe seu nome completo.";
    const age = Number(values.age);
    if (!values.age || Number.isNaN(age) || age < 1 || age > 120)
      next.age = "Informe uma idade válida.";
    if (!isValidCpf(values.cpf)) next.cpf = "CPF inválido.";
    if (onlyDigits(values.phone).length < 10) next.phone = "Telefone inválido.";
    if (!emailRe.test(values.email)) next.email = "E-mail inválido.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus(null);
    if (!validate()) {
      setStatus({ kind: "err", message: "Corrija os campos destacados e tente novamente." });
      return;
    }
    setStatus({
      kind: "ok",
      message: `Tudo certo! Recebemos seus dados${files.length ? ` e ${files.length} documento(s)` : ""}. Em breve entraremos em contato.`,
    });
  }

  const hasError = (key: keyof Errors) => Boolean(errors[key]);

  return (
    <section id="contato" className="section section--form">
      <div className="container form-layout">
        <div className="form-intro">
          <h2>Fale conosco</h2>
          <p>
            Preencha os dados e anexe documentos se precisar. Tudo é validado
            antes do envio.
          </p>
        </div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Nome completo *</label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              aria-invalid={hasError("name")}
              maxLength={120}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="age">Idade *</label>
              <input
                id="age"
                type="number"
                inputMode="numeric"
                min={1}
                max={120}
                value={values.age}
                onChange={(e) => setField("age", e.target.value)}
                aria-invalid={hasError("age")}
              />
              {errors.age && <p className="error">{errors.age}</p>}
            </div>
            <div className="field">
              <label htmlFor="cpf">CPF *</label>
              <input
                id="cpf"
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={values.cpf}
                onChange={(e) => setField("cpf", formatCpf(e.target.value))}
                aria-invalid={hasError("cpf")}
                maxLength={14}
              />
              {errors.cpf && <p className="error">{errors.cpf}</p>}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="phone">Número / WhatsApp *</label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                placeholder="(11) 99999-9999"
                value={values.phone}
                onChange={(e) => setField("phone", formatPhone(e.target.value))}
                aria-invalid={hasError("phone")}
                maxLength={15}
              />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>
            <div className="field">
              <label htmlFor="email">E-mail *</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => setField("email", e.target.value)}
                aria-invalid={hasError("email")}
                maxLength={160}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="files">Anexos (opcional)</label>
            <input
              id="files"
              ref={fileInput}
              type="file"
              multiple
              accept={ACCEPTED.join(",")}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <p className="hint">
              PDF, imagens ou Word — até {MAX_FILES} arquivos, {formatBytes(MAX_FILE_SIZE)} cada.
            </p>
            {errors.files && <p className="error">{errors.files}</p>}
            {files.length > 0 && (
              <ul className="file-list">
                {files.map((f) => (
                  <li key={f.name + f.size}>
                    <span>{f.name}</span>
                    <small>{formatBytes(f.size)}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {status && (
            <p className="form-status" data-kind={status.kind} role="status" aria-live="polite">
              {status.message}
            </p>
          )}

          <button className="btn btn--block" type="submit">
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
