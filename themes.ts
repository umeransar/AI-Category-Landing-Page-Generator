export interface ColorPalette {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textOnPrimary: string;
}

export const PALETTES: Record<string, ColorPalette> = {
    // --- Christmas & Holiday ---
    'christmas-traditional': {
        primary: '#C8102E', // Bright Red
        secondary: '#F8F8F8', // Off-white
        accent: '#1A2E05', // Dark Green
        background: '#FFFFFF', // White
        text: '#1A2E05', // Dark Green
        textOnPrimary: '#FFFFFF',
    },
    'winter-wonderland': {
        primary: '#A7C7E7', // Icy Blue
        secondary: '#F0F8FF', // Alice Blue
        accent: '#C0C0C0', // Silver
        background: '#FFFFFF', // White
        text: '#003366', // Dark Navy
        textOnPrimary: '#003366',
    },

    // --- Black Friday & Cyber Monday ---
    'black-friday-bold': {
        primary: '#E5007A', // Hot Pink
        secondary: '#1C1C1E', // Almost Black
        accent: '#333333', // Dark Gray
        background: '#0D0D0D', // True Black
        text: '#F5F5F7', // Off-white
        textOnPrimary: '#FFFFFF',
    },
    'cyber-monday-tech': {
        primary: '#00BFFF', // Deep Sky Blue (Cyber)
        secondary: '#23272A', // Dark Charcoal
        accent: '#99AAB5', // Grayish Blue
        background: '#141414', // Very Dark Gray
        text: '#FFFFFF', // White
        textOnPrimary: '#141414',
    },

    // --- Thanksgiving & Autumn ---
    'autumn-harvest': {
        primary: '#D95B00', // Burnt Orange
        secondary: '#FFF8E1', // Cream
        accent: '#8C3B00', // Brown
        background: '#FFFFFF', // White
        text: '#4A2B00', // Dark Brown
        textOnPrimary: '#FFFFFF',
    },
    'thanksgiving-warm': {
        primary: '#800000', // Maroon
        secondary: '#F5DEB3', // Wheat
        accent: '#DAA520', // Goldenrod
        background: '#FFFAF0', // Floral White
        text: '#5D4037', // Dark Brown
        textOnPrimary: '#FFFFFF',
    },

    // --- General & Professional ---
    'professional-blue': {
        primary: '#005A9C', // Strong Blue
        secondary: '#F0F4F8', // Light Gray-Blue
        accent: '#D0D6DD', // Muted Gray
        background: '#FFFFFF', // White
        text: '#212934', // Dark Slate
        textOnPrimary: '#FFFFFF',
    },
    'modern-dark': {
        primary: '#4F46E5', // Indigo
        secondary: '#1F2937', // Dark Slate Gray
        accent: '#374151', // Medium Slate Gray
        background: '#111827', // Very Dark Blue
        text: '#F9FAFB', // Light Gray
        textOnPrimary: '#FFFFFF',
    },
    'elegant-cream': {
        primary: '#BFA181', // Muted Gold/Tan
        secondary: '#FDFBF7', // Off-white cream
        accent: '#EAE6E1', // Light gray
        background: '#FFFFFF', // White
        text: '#484038', // Dark Brown-Gray
        textOnPrimary: '#FFFFFF',
    }
};