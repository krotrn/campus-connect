

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface CardConfig {
  title: string;
  description?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  footerContent?: React.ReactNode;
  className?: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "tel" | "url";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface ButtonConfig {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}
