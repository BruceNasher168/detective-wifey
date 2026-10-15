import React from 'react';

export type TypographyVariant =
  | 'large-title'
  | 'title-1'
  | 'title-2'
  | 'title-3'
  | 'headline'
  | 'body'
  | 'callout'
  | 'subheadline'
  | 'footnote'
  | 'caption-1'
  | 'caption-2'
  | 'lockpad-digit'
  | 'lockpad-subtext';

export const variantClasses: Record<TypographyVariant, string> = {
  'large-title': 'text-ios-large-title',
  'title-1': 'text-ios-title-1',
  'title-2': 'text-ios-title-2',
  'title-3': 'text-ios-title-3',
  'headline': 'text-ios-headline',
  'body': 'text-ios-body',
  'callout': 'text-ios-callout',
  'subheadline': 'text-ios-subheadline',
  'footnote': 'text-ios-footnote',
  'caption-1': 'text-ios-caption-1',
  'caption-2': 'text-ios-caption-2',
  'lockpad-digit': 'text-ios-lockpad-digit',
  'lockpad-subtext': 'text-ios-lockpad-subtext',
};

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant: TypographyVariant;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'label';
  tabular?: boolean;
  className?: string; // Strictly for color (e.g. 'text-[#EE4D2D]'), truncation, or layout
}

/**
 * Universal Atomic Typography Primitive
 * Enforces shared Apple HIG font scale, font weights, line-height, and tracking,
 * while allowing caller to pass color, layout, or alignment via className.
 */
export const Text: React.FC<TextProps> = ({
  variant,
  as: Component = 'span',
  tabular = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <Component
      className={`${variantClasses[variant]} ${tabular ? 'tabular-nums' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

