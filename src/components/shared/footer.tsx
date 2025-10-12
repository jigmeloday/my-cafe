import Link from 'next/link';

function Footer() {
  return (
    <footer className="bg-black text-primary-50 px-[16px] lg:px-[112px] py-[80px]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* About Section */}
        <div>
          <h5 className="text-primary-50 mb-4">About Us</h5>
          <p className="opacity-80">
            Discover, review, and bookmark your favorite cafés. Connect with a
            community of coffee lovers and stay inspired.
          </p>
        </div>

        {/* Explore Section */}
        <div>
          <h5 className="text-primary-50 mb-4">Explore</h5>
          <ul className="space-y-2 text-md opacity-80">
            <li>
              <Link
                href="/cafes/top-rated"
                className="hover:text-primary-300 transition"
              >
                Top Rated Cafés
              </Link>
            </li>
            <li>
              <Link
                href="/cafes/featured"
                className="hover:text-primary-300 transition"
              >
                Featured Cafés
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="hover:text-primary-300 transition"
              >
                Upcoming Events
              </Link>
            </li>
            <li>
              <Link href="/blogs" className="hover:text-primary-300 transition">
                Our Blogs
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links / Café Owners */}
        <div>
          <h5 className="text-primary-50 mb-4">Café Owners</h5>
          <ul className="space-y-2 text-md opacity-80">
            <li>
              <Link
                href="/register-cafe"
                className="hover:text-primary-300 transition"
              >
                Register Your Café
              </Link>
            </li>
            <li>
              <Link
                href="/manage/menus"
                className="hover:text-primary-300 transition"
              >
                Manage Menus
              </Link>
            </li>
            <li>
              <Link
                href="/manage/events"
                className="hover:text-primary-300 transition"
              >
                Manage Events
              </Link>
            </li>
            <li>
              <Link
                href="/analytics"
                className="hover:text-primary-300 transition"
              >
                Analytics
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-primary-50 mb-4">Users</h5>
          <ul className="space-y-2 text-md opacity-80">
            <li>
              <Link
                href="/register"
                className="hover:text-primary-300 transition"
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                href="/favorites"
                className="hover:text-primary-300 transition"
              >
                My Favorites
              </Link>
            </li>
            <li>
              <Link
                href="/reviews"
                className="hover:text-primary-300 transition"
              >
                My Reviews
              </Link>
            </li>
            <li>
              <Link
                href="/bookmarks"
                className="hover:text-primary-300 transition"
              >
                Bookmarked Cafés
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h5 className="text-primary-50 mb-4">Follow Us</h5>
          <div className="flex space-x-4 text-primary-300">
            <Link href="#" className="hover:text-primary-50 transition">
              FB
            </Link>
            <Link href="#" className="hover:text-primary-50 transition">
              IG
            </Link>
            <Link href="#" className="hover:text-primary-50 transition">
              TW
            </Link>
            <Link href="#" className="hover:text-primary-50 transition">
              LN
            </Link>
          </div>
        </div>
      </div>

      {/* Legal links */}
      <div className="mt-16 border-t border-primary-100 pt-6 text-sm text-center opacity-70 flex flex-col sm:flex-row justify-center gap-4">
        <span>
          &copy; {new Date().getFullYear()} Café Portal. All rights reserved.
        </span>
        <Link href="/privacy" className="hover:text-primary-300 transition">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:text-primary-300 transition">
          Terms & Conditions
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
