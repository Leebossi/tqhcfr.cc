
import { useState } from 'react'

type FormState = { name: string; email: string }
type Errors = Partial<FormState>

function validate(values: FormState): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = 'Nimi on pakollinen.'
  if (!values.email.trim()) {
    errors.email = 'Sähköposti on pakollinen.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Anna kelvollinen sähköpostiosoite.'
  }
  return errors
}

function App() {
  const [values, setValues] = useState<FormState>({ name: '', email: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    const errs = validate(values)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="container" style={{ paddingTop: 'var(--space-12)' }}>
      <p className="eyebrow">End Of Days 2026 Hämeenlinna</p>
      <h1 style={{ fontSize: 'var(--text-3xl)', textTransform: 'uppercase', marginBottom: 'var(--space-6)' }}>
        Ilmoittaudu ajamaan
      </h1>

      {submitted ? (
        <div className="success-box">
          <h2>Oot fölis!</h2>
          <p style={{ margin: 0, color: 'var(--color-muted)' }}>
            Kiitos ilmoittautumisestasi, <strong>{values.name}</strong>.
          </p>
        </div>
      ) : (
        <div className="surface">
          <form className="card stack" onSubmit={handleSubmit} noValidate>
            <label className="stack" style={{ gap: 'var(--space-2)' }}>
              <span style={{ fontWeight: 600 }}>Nimi</span>
              <input
                className={`input${errors.name ? ' is-error' : ''}`}
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>

            <label className="stack" style={{ gap: 'var(--space-2)' }}>
              <span style={{ fontWeight: 600 }}>Sähköposti</span>
              <input
                className={`input${errors.email ? ' is-error' : ''}`}
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: 'var(--space-2)' }}
            >
              Ilmoittaudu
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
