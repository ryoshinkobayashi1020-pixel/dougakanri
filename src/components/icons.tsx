export function CameraIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 8.5C4 7.67 4.67 7 5.5 7H8l1.2-1.6c.28-.37.72-.6 1.2-.6h3.2c.48 0 .92.23 1.2.6L16 7h2.5c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-13C4.67 19 4 18.33 4 17.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ScissorsIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="6" cy="6.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="6" cy="17.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7.8 8 19 18.5M7.8 16 19 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CalendarIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="4"
        y="5.5"
        width="16"
        height="14"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M4 9.5h16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function FolderIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 7.2c0-.94.76-1.7 1.7-1.7h4.1l1.6 1.9h6.9c.94 0 1.7.76 1.7 1.7v8.1c0 .94-.76 1.7-1.7 1.7H5.7A1.7 1.7 0 0 1 4 17.2V7.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M5 12.5 9.5 17 19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClapperIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 10.2 5.4 5h13.2L20 10.2H4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m7 5 2 4.4M11.2 5l2 4.4M15.4 5l2 4.4" stroke="currentColor" strokeWidth="1.6" />
      <rect
        x="4"
        y="10.2"
        width="16"
        height="8.8"
        rx="1.4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function TrashIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M5.5 7.5h13M9.5 7.5V6a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 6v1.5M7 7.5l.7 10.2A1.8 1.8 0 0 0 9.5 19.4h5a1.8 1.8 0 0 0 1.8-1.7l.7-10.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
