import Section from "./Section";
import Heading from "./Heading";
import { service1 } from "../assets";
import Generating from "./Generating";
import { Gradient } from "./design/Services";
import aivideo from "../assets/ai-video.mp4";

const Services = () => {
  return (
    <Section id="how-to-use">
      <div className="container">
        <Heading
          title="Generative AI made for creators."
          text="Brainwave unlocks the potential of AI-detection"
        />

        <div className="relative">
          <div className="relative z-1 flex items-center h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[46rem]">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none md:w-3/5 xl:w-auto">
              <img
                className="w-full h-full object-cover md:object-right"
                width={800}
                alt="Smartest AI"
                height={730}
                src={service1}
              />
            </div>

            {/* Video Container */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <video
                className="w-250 h-[80%] rounded-md"
                src={aivideo}
                muted
                controls
              />
            </div>

            <Generating className="absolute left-4 right-4 bottom-4 border-n-1/10 border lg:left-1/2 lg-right-auto lg:bottom-8 lg:-translate-x-1/2" />
          </div>

          <Gradient />
        </div>
      </div>
    </Section>
  );
};

export default Services;
