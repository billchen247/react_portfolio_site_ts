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
//   • Radio buttons — a group where every <input type="radio"> shares the same
//     `name`. Only one can be checked at a time; the checked one's `value`
//     becomes the form's value for that name. We wrap them in a <fieldset>
//     with a <legend> so screen readers announce the whole group + label.
//   • Checkboxes — booleans. They report state via `event.target.checked`
//     (not `event.target.value`), so the shared onChange handler has to
//     branch on `event.target.type`.
//   • <select> dropdown — a controlled dropdown mirrors a controlled text
//     input: `value={...}` picks which <option> is selected, `onChange`
//     fires when the user picks a different one. Pattern-wise it slots
//     into the same shared handler as text inputs.
//   • Functional state updater `setValues(prev => next)`: use this when the
//     next state depends on the previous one. Safer than reading the current
//     `formValues` directly because React can batch multiple updates.
//   • event.preventDefault(): stops the browser's default form submit (which
//     would reload the page). We handle the submit ourselves.
//   • Cross-page communication via router state: navigate('/', { state: X })
//     hands `X` to the destination page, which reads it with useLocation().
//   • TypeScript event types: React ships generic event types keyed by the
//     element that fired them. `ChangeEvent<HTMLInputElement>` describes an
//     input's onChange event; `FormEvent<HTMLFormElement>` describes a form's
//     onSubmit event. Using them gives you autocomplete on `event.target`.
//   • `import type` — a TypeScript-only form of `import` for values that
//     exist ONLY in the type system. It gets erased at build time (nothing
//     ships to the browser), so it's the right choice for pure type imports
//     like ChangeEvent / FormEvent.
//   • TypeScript "union of string literals" — see `PreferredContactMethod`
//     below. It restricts a field to a fixed set of values, so a typo like
//     `preferredContactMethod: 'emial'` fails to compile.
//
//   • Input validation — two complementary layers:
//     1. HTML5 constraint attributes (`required`, `type="email"`, `pattern`,
//        `minLength`, `maxLength`, `min`/`max`). Zero JavaScript required.
//        Great for simple rules and free-of-charge on every browser.
//     2. Custom JS validation — a `validate()` function that inspects the
//        state object and returns per-field error messages. More flexible
//        (cross-field rules, dynamic messages, integration with server
//        errors), but you own the code.
//     We use BOTH here: HTML5 for cheap rules (maxLength on names,
//     minLength/maxLength on message, pattern on phone), and a custom
//     validate() as the authoritative check on submit. We ALSO set
//     `noValidate` on the <form> so the browser's popup UI doesn't fight
//     our custom messages — the HTML5 attributes still show up as
//     `event.target.validity` if we want them, but the browser stays quiet.
//   • `errors` + `touched` state — a classic React form pattern. `errors`
//     is a map of field-name → error message; `touched` is a map of
//     field-name → "has the user blurred this yet?". We only display an
//     error message when both are truthy for the field, so the form isn't
//     screaming red before the user has even started typing.
//   • Accessible errors — each error <p> gets an `id`, and the invalid
//     <input> gets `aria-invalid="true"` plus `aria-describedby={errorId}`.
//     Screen readers then announce the error alongside the field label.
// -----------------------------------------------------------------------------
import { useState } from 'react';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

// Union of string literals: `PreferredContactMethod` can ONLY be one of these
// three exact strings. This is TypeScript's version of an "enum-lite" — it
// keeps the runtime values as plain strings while giving compile-time safety.
type PreferredContactMethod = 'email' | 'phone' | 'either';

// Data for the radio-button group. Defining the options as an array (instead
// of hard-coding three <input> tags) makes it trivial to add a new option:
// append one entry here and every part below picks it up.
//
// `as const` (a "const assertion") tells TypeScript to treat the string
// literals as their narrow literal types instead of widening them to
// `string`, so each `value` still fits `PreferredContactMethod`.
const CONTACT_METHOD_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'either', label: 'Either is fine' }
] as const;

// Options for the "How did you hear about me?" dropdown. `''` is the value
// when nothing has been picked yet — pairing it with a disabled placeholder
// <option> lets us keep the field controlled and still `required`.
type ReferralSource = '' | 'google' | 'linkedin' | 'referral' | 'other';

const REFERRAL_SOURCE_OPTIONS: { value: ReferralSource; label: string }[] = [
  { value: 'google', label: 'Search engine (Google, DuckDuckGo, …)' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'referral', label: 'A friend or colleague' },
  { value: 'other', label: 'Somewhere else' }
];

// Shape of the form's state. Each key is the `name` attribute of one input.
type ContactFormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  preferredContactMethod: PreferredContactMethod;
  referralSource: ReferralSource;
  subscribeToUpdates: boolean;
};

// A field name is any key of ContactFormValues. Using `keyof` here means if we
// add a new field to the state type, TS reminds us to think about validation
// and touched-tracking for it too.
type FieldName = keyof ContactFormValues;

// Errors and touched are "partial" maps: not every field is required to have
// an entry. `Partial<Record<K, V>>` is idiomatic TS for "keys of K → V, all
// optional".
type FormErrors = Partial<Record<FieldName, string>>;
type TouchedFields = Partial<Record<FieldName, boolean>>;

// Empty shape used both for the initial state and to reset after submission.
// Defining it once at module scope avoids re-creating the object on every
// render and keeps the "what fields does this form have?" answer in one place.
const EMPTY_FORM: ContactFormValues = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  message: '',
  // Radios need SOMETHING selected as the initial state or the group will be
  // uncontrolled. 'email' is the friendliest default here.
  preferredContactMethod: 'email',
  // Empty string pairs with the disabled placeholder <option> in the
  // dropdown below, so the initial render shows "Choose one…" and the
  // browser's `required` check will block submit until the user picks.
  referralSource: '',
  // Checkboxes default to unchecked (`false`). It's important the initial
  // value matches the input type, otherwise React treats it as uncontrolled.
  subscribeToUpdates: false
};

// A deliberately simple email regex. Real-world email validation is famously
// impossible with a regex — the RFC accepts things you'd never expect — so
// most apps accept "looks-like-an-address" and let the actual send-attempt
// prove deliverability. This pattern catches the obvious mistakes (missing
// @, missing TLD) without rejecting valid unusual addresses.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lenient phone pattern: digits plus common formatting punctuation. We are
// not trying to validate that this is a REAL phone number — just that it
// looks phone-shaped. The same pattern is echoed in the HTML5 `pattern`
// attribute below so users on older browsers still get feedback.
const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

// Names: letters, spaces, apostrophes, hyphens, periods. Covers "Mary Anne",
// "O'Brien", "Smith-Jones", "Dr.". Digits and other symbols get flagged.
const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'.\- ]{0,39}$/;

const MESSAGE_MIN_LENGTH = 10;
const MESSAGE_MAX_LENGTH = 500;

// Pure function: same input → same output, no side effects. That makes it
// trivial to test (and easy to reason about). It takes a snapshot of the
// form state and returns a map of the errors it found. An empty object
// means "no errors".
function validate(values: ContactFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required.';
  } else if (!NAME_PATTERN.test(values.firstName.trim())) {
    errors.firstName = 'Use letters, spaces, hyphens, or apostrophes only.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  } else if (!NAME_PATTERN.test(values.lastName.trim())) {
    errors.lastName = 'Use letters, spaces, hyphens, or apostrophes only.';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!PHONE_PATTERN.test(values.phone.trim())) {
    errors.phone = 'Enter 7–20 characters — digits, spaces, +, -, ( or ).';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'That doesn\'t look like a valid email address.';
  }

  if (!values.referralSource) {
    errors.referralSource = 'Please pick where you heard about me.';
  }

  const trimmedMessage = values.message.trim();
  if (!trimmedMessage) {
    errors.message = 'Message is required.';
  } else if (trimmedMessage.length < MESSAGE_MIN_LENGTH) {
    errors.message = `Message must be at least ${MESSAGE_MIN_LENGTH} characters (currently ${trimmedMessage.length}).`;
  } else if (trimmedMessage.length > MESSAGE_MAX_LENGTH) {
    errors.message = `Message must be ${MESSAGE_MAX_LENGTH} characters or fewer (currently ${trimmedMessage.length}).`;
  }

  // `preferredContactMethod` is guaranteed by the union type + radio group
  // to be one of the three valid values, and `subscribeToUpdates` has no
  // constraint, so no cases for them.

  return errors;
}

export default function Contact() {
  // `formValues` holds every field value as one object. Keeping related state
  // together like this is usually simpler than N separate useState calls when
  // the fields always change/reset together.
  const [formValues, setFormValues] = useState<ContactFormValues>(EMPTY_FORM);

  // Validation-adjacent state. Kept in TWO objects instead of merging into
  // formValues on purpose — `values` should stay serializable (nothing but
  // form data), and errors/touched are derived UI concerns.
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});

  const navigate = useNavigate();

  // One handler serves every input (text, tel, email, textarea, radio,
  // checkbox, select). It reads the input's `name` from the DOM event,
  // then produces a new object with just that field updated. Notice we DO
  // NOT mutate the old object (React needs a new reference to detect the
  // change and re-render).
  //
  // Text/tel/email/textarea/radio/select all report their new value on
  // `event.target.value` (radio reports the `value` attribute of the
  // *selected* option; select reports the `value` of the chosen <option>).
  // Checkboxes are different: they report a boolean on `event.target.checked`.
  // We inspect `event.target.type` and pick the right one — a common
  // pattern for "one handler, many input types".
  //
  // The event type is the union of every element that fires onChange in
  // this form. Adding <HTMLSelectElement> here is what makes the shared
  // handler compatible with the referralSource dropdown below.
  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = event.target;
    const { name, type } = target;
    // `type === 'checkbox'` narrows `target` to HTMLInputElement inside this
    // branch, so `target.checked` is safe to access.
    const nextValue =
      type === 'checkbox' && target instanceof HTMLInputElement
        ? target.checked
        : target.value;

    const fieldName = name as FieldName;

    // Object spread: copy all previous keys, then overwrite the one that
    // changed. `[name]` is a "computed property key" — the key is the value
    // of the `name` variable, not the literal string "name".
    setFormValues((previousValues) => ({
      ...previousValues,
      [fieldName]: nextValue
    }));

    // When the user starts editing a field that had an error, clear THAT
    // field's error so the red message goes away while they type. We DON'T
    // re-run full validation here — running validate() on every keystroke
    // makes the form feel nagging. The blur handler + submit handler are
    // the right places for that.
    if (errors[fieldName]) {
      setErrors((previousErrors) => {
        const next = { ...previousErrors };
        delete next[fieldName];
        return next;
      });
    }
  };

  // onBlur fires when a field loses focus (user tabs away or clicks
  // elsewhere). This is the canonical "the user is done with this field"
  // moment — we mark it touched and re-run validation so any error for
  // this field appears.
  //
  // We validate the WHOLE form here, but only the errors for touched
  // fields will be displayed — see the JSX below. That way the error map
  // is always up to date without spraying errors onto fields the user
  // hasn't reached yet.
  const handleFieldBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const fieldName = event.target.name as FieldName;
    setTouched((previous) => ({ ...previous, [fieldName]: true }));
    setErrors(validate(formValues));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Without this, the browser would try to POST the form to the current
    // URL and refresh the page, which would blow away our React app state.
    event.preventDefault();

    // Full-form validation on submit. If ANY field has an error, we mark
    // every field touched (so all messages appear at once) and abort the
    // submission. The user then fixes each in turn; blur handlers will
    // clear errors as they get resolved.
    const nextErrors = validate(formValues);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      // `Object.keys(EMPTY_FORM)` gives us the field names to mark touched.
      // We could also enumerate the union type, but keys of an object of
      // the same shape is a nice single source of truth.
      const allTouched: TouchedFields = {};
      (Object.keys(EMPTY_FORM) as FieldName[]).forEach((name) => {
        allTouched[name] = true;
      });
      setTouched(allTouched);
      return;
    }

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
    setErrors({});
    setTouched({});

    // navigate() with `state` passes data to the next page. Home.tsx reads
    // it via useLocation().state and renders the "Thanks, ___" banner.
    navigate('/', { state: { justSubmitted: true, firstName: submittedFirstName } });
  };

  // Small helper — returns the error string to display for a field, or
  // undefined if we shouldn't display one yet. Keeps the JSX below tidy.
  const errorFor = (name: FieldName): string | undefined =>
    touched[name] ? errors[name] : undefined;

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
            submit button. `noValidate` disables the browser's own popup UI
            so our custom error messages are the single source of truth —
            the HTML5 attributes still serve as documentation of the rules. */}
        <form className="card contact-form" onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            {/* Wrapping <input> in <label> associates the label with the field
                automatically — no `for`/`id` juggling needed, and clicking
                the label focuses the input. */}
            <label className="form-field">
              <span>First name</span>
              {/* `autoComplete="given-name"` helps password managers and
                  browser autofill do the right thing. `maxLength={40}` is
                  an HTML5 constraint the browser enforces as the user types
                  — a nice safety net even without JS validation. */}
              <input
                type="text"
                name="firstName"
                autoComplete="given-name"
                maxLength={40}
                value={formValues.firstName}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                required
                aria-invalid={Boolean(errorFor('firstName'))}
                aria-describedby={errorFor('firstName') ? 'firstName-error' : undefined}
              />
              {/* Render the error message only when we have one. The `id`
                  matches `aria-describedby` above so screen readers link
                  the two. `role="alert"` makes assistive tech announce
                  the error the moment it appears. */}
              {errorFor('firstName') && (
                <p id="firstName-error" className="form-error" role="alert">
                  {errorFor('firstName')}
                </p>
              )}
            </label>

            <label className="form-field">
              <span>Last name</span>
              <input
                type="text"
                name="lastName"
                autoComplete="family-name"
                maxLength={40}
                value={formValues.lastName}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                required
                aria-invalid={Boolean(errorFor('lastName'))}
                aria-describedby={errorFor('lastName') ? 'lastName-error' : undefined}
              />
              {errorFor('lastName') && (
                <p id="lastName-error" className="form-error" role="alert">
                  {errorFor('lastName')}
                </p>
              )}
            </label>
          </div>

          <div className="form-row">
            <label className="form-field">
              <span>Phone</span>
              {/* `type="tel"` shows a phone-friendly keyboard on mobile.
                  `pattern` is a native HTML5 regex constraint. The value
                  here mirrors our custom `PHONE_PATTERN` so the browser and
                  our JS agree on what "valid" means. */}
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="+1 (555) 555-0123"
                pattern="[0-9+()\-\s]{7,20}"
                value={formValues.phone}
                onChange={handleFieldChange}
                onBlur={handleFieldBlur}
                required
                aria-invalid={Boolean(errorFor('phone'))}
                aria-describedby={errorFor('phone') ? 'phone-error' : undefined}
              />
              {errorFor('phone') && (
                <p id="phone-error" className="form-error" role="alert">
                  {errorFor('phone')}
                </p>
              )}
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
                onBlur={handleFieldBlur}
                required
                aria-invalid={Boolean(errorFor('email'))}
                aria-describedby={errorFor('email') ? 'email-error' : undefined}
              />
              {errorFor('email') && (
                <p id="email-error" className="form-error" role="alert">
                  {errorFor('email')}
                </p>
              )}
            </label>
          </div>

          {/* Dropdown / <select>.
              Controlled the same way as a text input: `value={...}` picks
              the selected <option>, `onChange` fires when the user picks a
              different one. The FIRST <option> is a disabled placeholder
              with an empty `value` — because our state starts as '', that
              option renders as the visible label. Marking the <select>
              `required` combined with the empty placeholder value lets the
              HTML5 validation model treat "nothing chosen" as invalid. */}
          <label className="form-field">
            <span>How did you hear about me?</span>
            <select
              name="referralSource"
              value={formValues.referralSource}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              required
              aria-invalid={Boolean(errorFor('referralSource'))}
              aria-describedby={
                errorFor('referralSource') ? 'referralSource-error' : undefined
              }
            >
              <option value="" disabled>
                Choose one…
              </option>
              {REFERRAL_SOURCE_OPTIONS.map((option) => (
                // `key` on <option> follows the same rule as any other list:
                // use a stable unique value (the option's `value` here).
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errorFor('referralSource') && (
              <p id="referralSource-error" className="form-error" role="alert">
                {errorFor('referralSource')}
              </p>
            )}
          </label>

          {/* Radio-button group.
              <fieldset> + <legend> is the semantic HTML for grouped form
              controls: the <legend> becomes the group's accessible name, so
              screen readers announce "Preferred contact method — Email,
              radio button, 1 of 3" instead of just "Email". */}
          <fieldset className="form-fieldset">
            <legend>Preferred contact method</legend>
            <div className="radio-group">
              {CONTACT_METHOD_OPTIONS.map((option) => (
                <label key={option.value} className="radio-option">
                  {/* Every radio in the group shares `name="preferredContactMethod"`.
                      `checked` is derived from state — the ONE whose `value`
                      matches state is the selected one. That's what makes
                      this a "controlled" radio group. */}
                  <input
                    type="radio"
                    name="preferredContactMethod"
                    value={option.value}
                    checked={formValues.preferredContactMethod === option.value}
                    onChange={handleFieldChange}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="form-field">
            <span>Message</span>
            {/* <textarea> is a controlled input just like <input>. Note that
                in JSX you set the value via the `value` prop — unlike raw
                HTML where the text goes between the opening/closing tags.
                `minLength` and `maxLength` are HTML5 constraints — the
                browser will refuse to submit the form (and shows a native
                message) if these are violated, though we've disabled the
                popup UI via `noValidate` above and rely on our own
                messages. */}
            <textarea
              name="message"
              rows={5}
              minLength={MESSAGE_MIN_LENGTH}
              maxLength={MESSAGE_MAX_LENGTH}
              value={formValues.message}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              required
              aria-invalid={Boolean(errorFor('message'))}
              aria-describedby={errorFor('message') ? 'message-error' : undefined}
            />
            {/* Character counter — a nice UX touch that also demonstrates
                deriving displayed data from state. Turns red past max. */}
            <p
              className={`form-hint ${
                formValues.message.length > MESSAGE_MAX_LENGTH ? 'over-limit' : ''
              }`}
            >
              {formValues.message.length}/{MESSAGE_MAX_LENGTH}
            </p>
            {errorFor('message') && (
              <p id="message-error" className="form-error" role="alert">
                {errorFor('message')}
              </p>
            )}
          </label>

          {/* Single checkbox.
              For a controlled checkbox, use `checked={boolean}` (NOT `value`),
              and read the new state from `event.target.checked` (which our
              shared handler already does).
              The label sits AFTER the input on purpose — the usual reading
              order for a checkbox is "☑ Do the thing", not "Do the thing ☑". */}
          <label className="checkbox-option">
            <input
              type="checkbox"
              name="subscribeToUpdates"
              checked={formValues.subscribeToUpdates}
              onChange={handleFieldChange}
            />
            <span>Subscribe to occasional project updates (no spam).</span>
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
