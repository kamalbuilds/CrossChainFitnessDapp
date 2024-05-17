// Meta Data
// ========================================================
export const metadata = {
    title: "CrossChainFitness",
    description: "Get fit, get muscles, get paid.",
    icons: {
        icon: "/favicon.ico"
    }
};

// Main Layout
// ========================================================
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
