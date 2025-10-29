import { assets } from "../assets/assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faBolt, faHeadset } from "@fortawesome/free-solid-svg-icons";

const About = () => {
  return (
    <div className="bg-[#fdf7f0] text-[#3d2b1f] min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3d2b1f] mb-4">
            <span className="block">ABOUT</span>
            <span className="block text-[#8b4513]">US</span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-[#3d2b1f] to-[#8b4513] mx-auto mt-6 rounded-full"></div>
          <p className="text-lg text-[#3d2b1f] opacity-80 mt-6 max-w-2xl mx-auto">
            Discover the story behind India's revolutionary fashion rental
            platform
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center mb-16">
          <div className="lg:w-1/2">
            <img
              className="w-full max-w-lg mx-auto lg:mx-0 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              src={assets.about_img}
              alt="About our clothing rental platform"
              draggable={false}
            />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <p className="text-lg leading-relaxed text-[#3d2b1f] opacity-90">
              At Vesper, we believe fashion should be accessible, sustainable,
              and endlessly exciting. Owning premium outfits for every occasion
              is costly and wasteful, so we're changing the rules.
            </p>
            <p className="text-lg leading-relaxed text-[#3d2b1f] opacity-90">
              We are India's first tech-driven fashion rental marketplace, where
              you can rent everything from everyday wear to ultra-luxury labels
              at a fraction of the cost. Our tiered subscription plans,
              on-demand rentals, and Closet Curator program let you explore new
              styles without the burden of ownership.
            </p>
            <p className="text-lg leading-relaxed text-[#3d2b1f] opacity-90">
              Every garment comes with our Pristine Promise - professionally
              cleaned, quality-checked, and delivered right to your doorstep. By
              partnering with brands and individuals, we not only give you
              access to stunning collections but also promote circular fashion,
              reducing waste and unlocking value from idle wardrobes.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3d2b1f] mb-4">
            <span className="block">WHY</span>
            <span className="block text-[#8b4513]">CHOOSE US</span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#3d2b1f] to-[#8b4513] mx-auto mt-6 rounded-full"></div>
          <p className="text-lg text-[#3d2b1f] opacity-80 mt-6 max-w-2xl mx-auto">
            Experience the difference with our premium service and commitment to
            excellence
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <div className="group bg-white border border-[#e8dccf] rounded-xl p-8 hover:shadow-xl hover:border-[#3d2b1f] transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#fdf7f0] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#3d2b1f] transition-colors duration-300">
                <FontAwesomeIcon
                  icon={faAward}
                  className="w-8 h-8 text-[#3d2b1f] group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#3d2b1f] mb-4 tracking-wide">
                Quality Assurance
              </h3>
            </div>
            <p className="text-[#3d2b1f] opacity-80 text-center leading-relaxed">
              We meticulously select and vet each product to ensure it meets our
              stringent quality standards.
            </p>
          </div>

          <div className="group bg-white border border-[#e8dccf] rounded-xl p-8 hover:shadow-xl hover:border-[#3d2b1f] transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#fdf7f0] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#3d2b1f] transition-colors duration-300">
                <FontAwesomeIcon
                  icon={faBolt}
                  className="w-8 h-8 text-[#3d2b1f] group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#3d2b1f] mb-4 tracking-wide">
                Convenience
              </h3>
            </div>
            <p className="text-[#3d2b1f] opacity-80 text-center leading-relaxed">
              With our user-friendly interface and hassle-free ordering process,
              shopping has never been easier.
            </p>
          </div>

          <div className="group bg-white border border-[#e8dccf] rounded-xl p-8 hover:shadow-xl hover:border-[#3d2b1f] transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#fdf7f0] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#3d2b1f] transition-colors duration-300">
                <FontAwesomeIcon
                  icon={faHeadset}
                  className="w-8 h-8 text-[#3d2b1f] group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#3d2b1f] mb-4 tracking-wide">
                Exceptional Experience
              </h3>
            </div>
            <p className="text-[#3d2b1f] opacity-80 text-center leading-relaxed">
              Our team of dedicated professionals is here to assist you every
              step of the way, ensuring your satisfaction is our top priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
