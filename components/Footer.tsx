export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-semibold text-neutral-100">जैन धर्म ब्लॉग</p>
          <p className="mt-1 max-w-md text-xs text-neutral-500">
            जैन धर्म की शिक्षाओं, भजनों, और आध्यात्मिक ज्ञान को साझा करने के लिए बनाया गया।
            अहिंसा, सत्य और आत्म-शुद्धि के मार्ग पर चलें।
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <span className="text-neutral-500">
            © {new Date().getFullYear()} जैन धर्म ब्लॉग। सभी अधिकार सुरक्षित।
          </span>
        </div>
      </div>
    </footer>
  );
}


