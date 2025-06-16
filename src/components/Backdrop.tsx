export default function Backdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-portage-600 -z-10">
      <header className="absolute left-6 top-6 z-10">
        <img src="/dsc_white.svg" alt="UW DSC logo" className="h-16 w-auto" />
      </header>
      <div
        className="
          absolute 
          w-[1920px] h-[1080px]
          top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
        "
      >
        <div className="absolute inset-0 bg-portage-600" />

        {/** Large bright circle top-right **/}
        <div
          className="
            absolute
            bg-portage-400 rounded-full
            w-[1300px] h-[1300px]
            -right-[300px] top-[-200px]
          "
        />

        {/** Mid‐tone circle overlapping center **/}
        <div
          className="
            absolute
            bg-portage-300 rounded-full
            opacity-50
            w-[1200px] h-[1200px]
            -top-[500px] left-[800px]
          "
        />

        {/** Bottom right circle **/}
        <div
          className="
            absolute
            bg-portage-500 rounded-full
            opacity-50
            w-[800px] h-[800px]
            -bottom-[000px] left-[1300px]
          "
        />

        {/** Small accent circle **/}
        <div
          className="
            absolute
            bg-portage-900 rounded-full
            w-[150px] h-[150px]
            top-[680px] right-[615px]
          "
        />

        {/** Orbits & dots **/}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1920 1080"
          fill="none"
        >
          <circle
            cx="1500"
            cy="640"
            r="650"
            stroke="white"
            strokeWidth="1"
            opacity="1"
          />
          {/* left circle */}
          <circle
            cx="500"
            cy="300"
            r="500"
            stroke="white"
            strokeWidth="1"
            opacity="1"
          />
          <circle
            cx="1470"
            cy="160"
            r="170"
            stroke="white"
            strokeWidth="1"
            opacity="1"
          />
          <circle
            cx="1490"
            cy="200"
            r="125"
            stroke="white"
            strokeWidth="1"
            opacity="1"
          />
          <circle cx="1600" cy="50" r="10" fill="white" />
          <circle cx="850" cy="660" r="10" fill="white" />
          <circle cx="1540" cy="315" r="10" fill="white" />
        </svg>

        {/** Big dark circle bottom-left **/}
        <div
          className="
            absolute
            bg-portage-950 rounded-full
            w-[500px] h-[500px] 
            -left-[0px] bottom-[-0px]
          "
        />
      </div>
    </div>
  );
}
