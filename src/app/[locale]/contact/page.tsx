import Image from 'next/image';

const ContactPage = () => {
  return (
    <section className="w-full bg-gray-100 text-gray-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Intro */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-8">
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-stone-400 shadow-sm shrink-0">
            <Image
              src="/artist.jpg"
              alt="Anikó Kocsis portrait"
              fill
              sizes="160px"
              className="object-cover"
              priority
            />
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
              Let’s Work Together
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-gray-600 max-w-2xl">
              If you’re interested in collaborating, commissioning a custom
              artwork, or acquiring one of my existing pieces, feel free to
              reach out. I’d be happy to discuss ideas, opportunities, or answer
              any questions you may have.
            </p>
          </div>
        </div>

        {/* Work Together */}
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Get in Touch
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-gray-600">
            I welcome your message and look forward to hearing from you.
          </p>
        </div>
      </div>

      {/* Contact form */}
      <div className="max-w-3xl mb-2 mx-auto px-6 py-10 bg-white border border-stone-300 rounded-xl shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-10 text-center">
          Contact me
        </h2>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Your full name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Your email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Your message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400 transition resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full border border-stone-500 text-stone-700 py-3 rounded-lg font-medium tracking-wide hover:bg-stone-700 hover:text-white transition"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;

