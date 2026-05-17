const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between bg-primary text-secondary px-8 py-4">
        <a href="/">WeryfikatorFachowca</a>

        <nav className="flex items-center gap-4">
          <a href="/auth/login">Login</a>
          <a href="/auth/register">Register</a>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8">
        {children}
      </main>

      <footer className="bg-primary text-secondary text-center px-8 py-4">
        <p>WeryfikatorFachowca &copy;2026</p>
      </footer>
    </div>
  );
};

export default Layout;
