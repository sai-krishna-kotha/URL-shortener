export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-5 sm:py-6 mt-auto">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500 leading-5">
        <p>&copy; {new Date().getFullYear()} URL Shortener. Built for speed and reliability.</p>
      </div>
    </footer>
  );
}
