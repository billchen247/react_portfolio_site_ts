// -----------------------------------------------------------------------------
// Contact.tsx — the /contact page and its form.
// Author: Bill Chen
//
// Concepts introduced here:
//   • Controlled inputs: each <input> has BOTH `value={...}` (React tells the
//     input what to display) AND `onChange={...}` (input tells React what the
//     user typed). This makes React state the single source of truth.
//   • Single change handler for a whole form: because every input has a `name`
//     matching a key in state, one handler using `event.target` can update
//     any field. Add a field → give it a `name` → done.
//   • Functional state updater `setValues(prev => next)`: use this when the
//     next state depends on the previous one. Safer than reading the current
//     `formValues` directly because React can batch multiple updates.
//   • event.preventDefault(): stops the browser's default form submit (which
//     would reload the page). We handle the submit ourselves.
//   • Cross-page communication via router state: navigate('/', { state: X })
//     hands `X` to the destination page, which reads it with useLocation().
// -----------------------------------------------------------------------------
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

// Shape of the form's state. Each key is the `name` attribute of one input.
type ContactFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
};

// Empty shape used both for the initial state and to reset after submission.
// Defining it once at module scope avoids re-creating the object on every
// render and keeps the "what fields does this form have?" answer in one place.
const EMPTY_FORM: ContactFormValues = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: ''
};

export default function Contact() {
  // `formValues` holds ALL five field values as one object. Keeping related
  // state together like this is usually simpler than five separate useState
  // calls when the fields always change/reset together.
  const [formValues, setFormValues] = useState<ContactFormValues>(EMPTY_FORM);
  const navigate = useNavigate();

  // One handler serves every input. It reads the input's `name` and `value`
  // from the DOM event, then produces a new object with just that field
  // updated. Notice we DO NOT mutate the old object (React needs a new
  // reference to detect the change and re-render).
  //
  // The event type covers both <input> and <textarea>; we `as` the `name`
  // to a known key of the form so the computed-property update is type-safe.
  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    // Object spread: copy all previous keys, then overwrite the one that
    // changed. `[name]` is a "computed property key" — the key is the value
    // of the `name` variable, not the literal string "name".
    setFormValues((previousValues) => ({
      ...previousValues,
      [name as keyof ContactFormValues]: value
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Without this, the browser would try to POST the form to the current
    // URL and refresh the page, which would blow away our React app state.
    event.preventDefault();

    // No backend is required for this assignment; the browser's built-in
    // `required`/`type` validation runs first, then we log the payload for
    // debugging and hand the captured values to Home via router state so a
    // visible confirmation banner can render there.
    // eslint-disable-next-line no-console
    console.log('Contact form submitted:', formValues);

    // Grab the first name BEFORE we reset the form, so we can greet them
    // by name on the confirmation banner.
    const submittedFirstName = formValues.firstName;
    setFormValues(EMPTY_FORM);

    // navigate() with `state` passes data to the next page. Home.tsx reads
    // it via useLocation().state and renders the "Thanks, ___" banner.
    navigate('/', { state: { justSubmitted: true, firstName: submittedFirstName } });
  };

  return (
    <section className="contact">
      <h1 className="section-title">Contact Me</h1>
      <p className="lead">
        Want to work together, ask a question, or just say hello? Reach out below
        and I'll get back to you within a couple of business days.
      </p>

      <div className="contact-grid">
        {/* <aside> is semantic HTML for content tangential to the main flow.
            Here it holds the direct-contact panel next to the form. */}
        <aside className="card contact-info">
          <h2>Get in touch</h2>
          {/* <dl>/<dt>/<dd> = "description list" — label/value pairs. */}
          <dl className="contact-info-list">
            <div>
              <dt>Email</dt>
              <dd>
                {/* mailto: and tel: open the user's email/phone app. */}
                <a href="mailto:hello@billchen.dev">hello@billchen.dev</a>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href="tel:+15555550123">+1 (555) 555-0123</a>
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>Toronto, Canada — open to remote</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>Mon–Fri, 9am–6pm ET</dd>
            </div>
          </dl>
        </aside>

        {/* onSubmit fires when the user hits Enter in a field OR clicks the
            submit button. `noValidate={false}` = keep default HTML5 checks. */}
        <form className="card contact-form" onSubmit={handleSubmit} noValidate={false}>
          <div className="form-row">
            {/* Wrapping <input> in <label> associates the label with the field
                automatically — no `for`/`id` juggling needed, and clicking
                the label focuses the input. */}
            <label className="form-field">
              <span>First name</span>
              {/* `autoComplete="given-name"` helps password managers and
                  browser autofill do the right thing. */}
              <input
                type="text"
                name="firstName"
                autoComplete="given-name"
                value={formValues.firstName}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="form-field">
              <span>Last name</span>
              <input
                type="text"
                name="lastName"
                autoComplete="family-name"
                value={formValues.lastName}
                onChange={handleFieldChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label className="form-field">
              <span>Phone</span>
              {/* `type="tel"` shows a phone-friendly keyboard on mobile. */}
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="+1 (555) 555-0123"
                value={formValues.phone}
                onChange={handleFieldChange}
                required
              />
            </label>

            <label className="form-field">
              <span>Email</span>
              {/* `type="email"` triggers the browser's built-in email format
                  check as part of `required` validation. */}
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formValues.email}
                onChange={handleFieldChange}
                required
              />
            </label>
          </div>

          <label className="form-field">
            <span>Message</span>
            {/* <textarea> is a controlled input just like <input>. Note that
                in JSX you set the value via the `value` prop — unlike raw
                HTML where the text goes between the opening/closing tags. */}
            <textarea
              name="message"
              rows={5}
              value={formValues.message}
              onChange={handleFieldChange}
              required
            />
          </label>

          {/* type="submit" makes clicking or pressing Enter trigger onSubmit
              on the parent <form>. Without it the browser defaults to
              "submit" anyway, but being explicit is clearer. */}
          <button type="submit" className="btn">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
