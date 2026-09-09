export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
      <div className="container mx-auto px-4 max-w-5xl text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} URL Shortener. Built for speed and reliability.</p>
      </div>
    </footer>
  );
}
