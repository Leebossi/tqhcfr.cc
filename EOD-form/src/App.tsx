import { useState } from "react";
import { supabase, supabaseConfigError } from "./supabase";

type FormState = { name: string; email: string };
type Errors = Partial<FormState>;
type Language = "fi" | "en";

const i18n: Record<Language, Record<string, string>> = {
  fi: {
    event: "End Of Days 2026 Hämeenlinna",
    title: "Ilmoittaudu ajamaan",
    disclaimer: "Ilmoittautuminen ei ole sitova. Tietojasi ei käytetä markkinointiin, niitä ei luovuteta kolmansille osapuolille, eikä niitä säilytetä tapahtuman jälkeen.",
    nameLabel: "Nimi",
    emailLabel: "Sähköposti",
    nameError: "Nimi on pakollinen.",
    emailErrorRequired: "Sähköposti on pakollinen.",
    emailErrorInvalid: "Anna kelvollinen sähköpostiosoite.",
    configError: "Ilmoittautuminen ei ole käytettävissä juuri nyt. Ei yhteyttä tietokantaan.",
    submitError: "Ilmoittautuminen epäonnistui. Yritä uudelleen.",
    submitting: "Lähetetään…",
    submit: "Ilmoittaudu",
    successTitle: "Oot fölis!",
    successMessage: "Kiitos ilmoittautumisestasi, {name}.",
  },
  en: {
    event: "End Of Days 2026 Hämeenlinna",
    title: "Register to ride",
    disclaimer: "Registration is non-binding. Your information will not be used for marketing, shared with third parties, or retained after the event.",
    nameLabel: "Name",
    emailLabel: "Email",
    nameError: "Name is required.",
    emailErrorRequired: "Email is required.",
    emailErrorInvalid: "Enter a valid email address.",
    configError: "Registration is unavailable right now. No connection to the database.",
    submitError: "Registration failed. Try again.",
    submitting: "Submitting…",
    submit: "Register",
    successTitle: "You're in!",
    successMessage: "Thanks for registering, {name}.",
  },
};

function validate(values: FormState, lang: Language): Errors {
  const t = i18n[lang];
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = t.nameError;
  if (!values.email.trim()) {
    errors.email = t.emailErrorRequired;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = t.emailErrorInvalid;
  }
  return errors;
}

function App() {
  const [lang, setLang] = useState<Language>("fi");
  const [values, setValues] = useState<FormState>({ name: "", email: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const t = i18n[lang];

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function toggleLanguage() {
    setLang(lang === "fi" ? "en" : "fi");
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(values, lang);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (supabaseConfigError || !supabase) {
      setServerError(t.configError);
      return;
    }
    setLoading(true);
    setServerError(null);
    const { error } = await supabase
      .from("registrations")
      .insert({ name: values.name, email: values.email });
    setLoading(false);
    if (error) {
      setServerError(t.submitError);
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="container" style={{ paddingTop: "var(--space-12)" }}>
      <nav>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={toggleLanguage}
        >
          {lang === "fi" ? "EN" : "FI"}
        </button>
      </nav>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-8)",
        }}
      >
        <div>
          <p className="eyebrow">{t.event}</p>
          <h1
            style={{
              fontSize: "var(--text-3xl)",
              textTransform: "uppercase",
              marginBottom: "var(--space-6)",
            }}
          >
            {t.title}
          </h1>
        </div>
      </div>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-muted)",
          }}
        >
          {t.disclaimer}
        </p>

      {submitted ? (
        <div className="success-box">
          <h2>{t.successTitle}</h2>
          <p style={{ margin: 0, color: "var(--color-muted)" }}>
            {t.successMessage.replace("{name}", values.name)}
          </p>
        </div>
      ) : (
        <div className="surface">
          <form className="card stack" onSubmit={handleSubmit} noValidate>
            <label className="stack" style={{ gap: "var(--space-2)" }}>
              <span style={{ fontWeight: 600 }}>{t.nameLabel}</span>
              <input
                className={`input${errors.name ? " is-error" : ""}`}
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && (
                <span className="field-error">{errors.name}</span>
              )}
            </label>

            <label className="stack" style={{ gap: "var(--space-2)" }}>
              <span style={{ fontWeight: 600 }}>{t.emailLabel}</span>
              <input
                className={`input${errors.email ? " is-error" : ""}`}
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </label>

            {serverError && <span className="field-error">{serverError}</span>}
            {supabaseConfigError && !serverError && (
              <span className="field-error">{t.configError}</span>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: "var(--space-2)" }}
              disabled={loading || Boolean(supabaseConfigError)}
            >
              {loading ? t.submitting : t.submit}
            </button>
          </form>
        </div>
      )}

      <footer className="footer">
        <a className="footer-link" href="https://tqhcfr.cc/events" target="_blank" rel="noreferrer">
          TQHCFR.cc
        </a>
      </footer>
    </div>
  );
}

export default App;
