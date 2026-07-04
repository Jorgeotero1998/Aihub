export function Icon({
  name,
  size = 18,
  color = "currentColor",
}: {
  name:
    | "spark"
    | "grid"
    | "bolt"
    | "doc"
    | "chat"
    | "calendar"
    | "report"
    | "bell"
    | "credit"
    | "shield"
    | "logout"
    | "arrow";
  size?: number;
  color?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  } as const;

  switch (name) {
    case "spark":
      return (
        <svg {...common}>
          <path
            d="M12 2l1.5 6.2L20 10l-6.5 1.8L12 18l-1.5-6.2L4 10l6.5-1.8L12 2Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <path
            d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path
            d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "doc":
      return (
        <svg {...common}>
          <path
            d="M7 3h7l3 3v15H7V3Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M14 3v4h4" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path
            d="M20 14a4 4 0 0 1-4 4H9l-5 3V6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "calendar":
      return (
        <svg {...common}>
          <path
            d="M7 3v3M17 3v3M4 8h16M6 6h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "report":
      return (
        <svg {...common}>
          <path
            d="M5 20V4h14v16H5Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8 16h8M8 12h8M8 8h5"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path
            d="M18 16H6l1-2v-4a5 5 0 1 1 10 0v4l1 2Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M10 16a2 2 0 0 0 4 0"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "credit":
      return (
        <svg {...common}>
          <path
            d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M4 9h16" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path
            d="M12 2 20 6v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4Z"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path
            d="M10 7V6a2 2 0 0 1 2-2h7v16h-7a2 2 0 0 1-2-2v-1"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12 12H4m0 0 3-3M4 12l3 3"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path
            d="M9 18 15 12 9 6"
            stroke={color}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

