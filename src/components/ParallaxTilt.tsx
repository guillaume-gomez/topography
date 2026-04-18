import React, { useRef, useState, useContext } from "react";
import { SceneContext } from "../context/SceneContextWrapper";
import { useSpring, useSpringRef, animated, easings, useChain, to } from '@react-spring/web';
import "./ParallaxTilt.css"

https://www.youtube.com/watch?v=x-7EAgNII50

interface ParallaxTiltProps {
  children: React.ReactNode;
  maxTilt?: number; // Maximum tilt in degrees
  scale?: number; // Scale on hover
  className?: string;
  style?: React.CSSProperties;
}

const translateZByLayer = [0, 40, 80, 120, 160, 200]

function ParallaxTilt({
  children,
  maxTilt = 20,
  scale = 1.05,
  className = "",
  style = {},
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    setSceneName
  } = useContext(SceneContext);

  const firstLayerPropsRef = useSpringRef();
  const secondLayerPropsRef = useSpringRef();
  const thirdLayerPropsRef = useSpringRef();
  const fourthLayerPropsRef = useSpringRef();
  const fifthLayerPropsRef = useSpringRef();
  const sixthLayerPropsRef = useSpringRef();
  const basePropsRef = useSpringRef();
  const titlePropsRef = useSpringRef();


  // top
  const firstLayerProps = useSpring(
    {
      ref: firstLayerPropsRef,
      from: { top: 2000, left: 0, opacity: 0, translateZ: 0 },
      to: { top: -120, left: -150, opacity: 1, translateZ: 0 },
      config: { easing: easings.easeInBack },
    }
  );

  //right
  const secondLayerProps = useSpring(
    {
      ref: secondLayerPropsRef,
      from: { top: 0, left: 2000, opacity: 0, translateZ: 40 },
      to: { top: -100, left: -60,  opacity: 1, translateZ: 40 },
      config: { easing: easings.easeInBack },
    }
  );

  // bottom
  const thirdLayerProps = useSpring(
    {
      ref: thirdLayerPropsRef,
      from: { top: -2000, left: 0, opacity: 0, translateZ: 80 },
      to: { top: 0, left: 0, opacity: 1, translateZ: 80 },
      config: { easing: easings.easeInBack },
    }
  );

  //left
  const fourthLayerProps = useSpring(
    {
      ref: fourthLayerPropsRef,
      from: { top: 60, left: -2000, opacity: 0, translateZ: 120 },
      to: { top: 60, left: 60, opacity: 1, translateZ: 120 },
      config: { easing: easings.easeInBack },
    }
  );

  // back
  const fifthLayerProps = useSpring(
    {
      ref: fifthLayerPropsRef,
      from: { translateZ: -2000, opacity: 0 },
      to: { translateZ: 160, opacity: 1 },
      config: { easing: easings.easeInBack },
    }
  );

  // front
  const sixthLayerProps = useSpring(
    {
      ref: sixthLayerPropsRef,
      from: { translateZ: 2000, opacity: 0 },
      to: { translateZ: 200, opacity: 1 },
      config: { easing: easings.easeInBack },
      onRest: () => {
        tiltApi.start({
          rotateX: 10,
          rotateY: 20,
        });
      }
    }
  );

  const titleProps = useSpring(
    {
      ref: titlePropsRef,
      from: { scaleY: 0, scaleX: 0.2, opacity: 0 },
      to: { scaleY: 1, scaleX: 1, opacity: 1 },
      config: { easing: easings.easeInBack },
    }
  )

  useChain(
    [firstLayerPropsRef, secondLayerPropsRef, thirdLayerPropsRef, fourthLayerPropsRef, fifthLayerPropsRef, sixthLayerPropsRef, titlePropsRef],
    [0, 1, 2, 3, 4, 5, 8],
    400
  );

  const [tiltProps, tiltApi] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    config: { mass: 1, tension: 180, friction: 30 },
  }));

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if(!cardRef || !cardRef.current) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;

    tiltApi.start({
      rotateX: -(y / rect.height) * 40,
      rotateY: (x / rect.width) * 40,
    });
  }

  function handleMouseLeave() {
    tiltApi.start({ rotateX: 0, rotateY: 0 });
  }

  return (
    <div className="p-24 perspective-[800px]" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <animated.div 
        ref={cardRef}
        className="card relative bg-red"
        style={{
          transformStyle: "preserve-3d",
          width: 500,
          height: 500,
          transform: to(
            [tiltProps.rotateX, tiltProps.rotateY],
            (tiltX, tiltY) => {
              return `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

            }
          )
        }}
      >
        <animated.svg viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="box"
            style={{
              transform: "translate3d(0, 0, -40px)",
              ...firstLayerProps
            }}
            width="800px"
            height="800px"
        >
          <path
            fill="#cad2c5"
            d="M41.9,-73.3C52,-66.8,56.2,-50.8,61.5,-37C66.9,-23.2,73.5,-11.6,73.1,-0.2C72.8,11.2,65.6,22.5,57.9,32.3C50.3,42.2,42.2,50.6,32.5,59C22.7,67.3,11.4,75.6,1.4,73.2C-8.7,70.9,-17.3,57.9,-25.6,48.8C-34,39.6,-42,34.2,-50.3,26.7C-58.5,19.3,-67,9.6,-71.6,-2.6C-76.1,-14.9,-76.7,-29.8,-69.1,-38.4C-61.5,-46.9,-45.6,-49.2,-32.7,-54C-19.8,-58.8,-9.9,-66.2,3,-71.4C15.9,-76.6,31.9,-79.7,41.9,-73.3Z"
            transform="translate(100 100)"
          />
        </animated.svg>

        <animated.svg viewBox="0 0 200 200"
             xmlns="http://www.w3.org/2000/svg"
             className="box"
             style={{
              transform: "translate3d(0, 0, 40px)",
              ...secondLayerProps
             }}
             width="650px"
             height="650px"
        >
          <path
            fill="#84a98c"
            d="M25.1,-46.5C32.5,-39.3,38.2,-32.3,47.9,-24.6C57.7,-16.9,71.5,-8.4,74.7,1.9C77.9,12.1,70.5,24.3,63.4,36.6C56.3,48.9,49.4,61.3,38.9,68.8C28.4,76.3,14.2,78.9,2.3,74.8C-9.5,70.7,-19,60,-33.3,54.7C-47.6,49.4,-66.8,49.5,-72.4,41.3C-77.9,33.1,-69.9,16.5,-68,1.1C-66.2,-14.4,-70.5,-28.8,-64.8,-36.9C-59.2,-45,-43.6,-46.8,-31.2,-51C-18.7,-55.2,-9.4,-61.8,-0.2,-61.5C8.9,-61.1,17.8,-53.7,25.1,-46.5Z"
            transform="translate(100 100)"
          />
        </animated.svg>
       
        <animated.svg viewBox="0 0 200 200"
             xmlns="http://www.w3.org/2000/svg"
             className="box"
             style={thirdLayerProps}
             width="500px"
             height="500px"
        >
          <path
            fill="#52796f"
            d="M37.8,-62.1C49.8,-58.6,60.9,-50.1,64.4,-38.9C67.9,-27.7,63.9,-13.9,65.4,0.8C66.8,15.5,73.8,31.1,72,45.2C70.2,59.4,59.6,72.1,46.1,72.8C32.7,73.4,16.3,61.9,2.2,58.1C-11.9,54.2,-23.8,58.1,-32.3,54.6C-40.8,51.1,-45.9,40.2,-55.8,29.9C-65.7,19.6,-80.4,9.8,-83.9,-2C-87.4,-13.8,-79.6,-27.7,-70.7,-39.7C-61.8,-51.8,-51.8,-62.1,-39.8,-65.6C-27.8,-69.1,-13.9,-65.9,-0.5,-65C12.9,-64.1,25.8,-65.6,37.8,-62.1Z"
            transform="translate(100 100)"
          />
        </animated.svg>


       <animated.svg viewBox="0 0 200 200"
             xmlns="http://www.w3.org/2000/svg"
             className="box" style={fourthLayerProps}
             width="350px"
             height="350px"
        >
          <path
            fill="#354f52"
            d="M42.1,-71.8C56.1,-64.8,70,-56.6,77.4,-44.5C84.9,-32.3,85.8,-16.2,81.1,-2.7C76.4,10.8,66.2,21.5,59,34.1C51.8,46.7,47.7,61.1,38.4,70.8C29.1,80.4,14.5,85.3,1.6,82.5C-11.3,79.7,-22.5,69.1,-34,60.7C-45.4,52.2,-56.9,45.9,-65.6,36.1C-74.3,26.4,-80.1,13.2,-81.6,-0.9C-83.2,-15,-80.5,-29.9,-73.4,-42.6C-66.4,-55.3,-55.2,-65.6,-42.2,-73.2C-29.3,-80.8,-14.6,-85.7,-0.3,-85.1C14,-84.6,28.1,-78.8,42.1,-71.8Z"
            transform="translate(100 100)"
          />
        </animated.svg>

        <animated.svg viewBox="0 0 200 200"
             xmlns="http://www.w3.org/2000/svg"
             className="box"
             style={{
              top: 110,
              left: 130,
              ...fifthLayerProps
             }}
             width="200px"
             height="200px"
        >
          <path 
              fill="#2f3e46"
              d="M25.7,-49C33.6,-39.9,40.5,-33.7,47.4,-26C54.3,-18.3,61.2,-9.1,64.6,2C68.1,13.1,68.2,26.3,65.1,40.5C62,54.8,55.7,70.2,44.3,73.7C32.9,77.1,16.5,68.6,3.3,62.9C-9.8,57.1,-19.7,54.1,-31,50.7C-42.4,47.2,-55.4,43.3,-63.8,34.8C-72.2,26.3,-76,13.1,-76.8,-0.4C-77.6,-14,-75.3,-28.1,-66.3,-35.5C-57.2,-43,-41.5,-43.8,-29.3,-50.4C-17.2,-57,-8.6,-69.5,0.2,-69.7C8.9,-70,17.8,-58.1,25.7,-49Z"
            transform="translate(100 100)"
          />
        </animated.svg>

        <animated.svg viewBox="0 0 200 200" 
             xmlns="http://www.w3.org/2000/svg"
             className="box"
             style={{
              top: 200,
              left: 200,
              ...sixthLayerProps
             }}
             width="50px"
             height="50px"
        >
          <path
              fill="#D8A47F"
              d="M41.9,-68.9C54.4,-65.3,64.6,-54.3,69.9,-41.5C75.2,-28.8,75.6,-14.4,70.8,-2.8C66,8.9,56.1,17.8,51.7,32.1C47.3,46.3,48.3,65.9,40.6,77.5C32.9,89.1,16.5,92.6,0.9,90.9C-14.6,89.3,-29.1,82.5,-41,73.3C-52.9,64.2,-62.1,52.7,-66.6,40C-71.1,27.4,-70.9,13.7,-69.7,0.7C-68.4,-12.3,-66.1,-24.5,-59.9,-34.3C-53.8,-44.1,-43.8,-51.3,-33.2,-56C-22.5,-60.6,-11.3,-62.7,1.7,-65.7C14.7,-68.7,29.4,-72.6,41.9,-68.9Z"
            transform="translate(100 100)"
          />
        </animated.svg>

      </animated.div>
      <animated.div
        style={{
          zIndex: 10, paddingTop: "6rem", ...titleProps
        }}
      >
        <h1 className="md:text-4xl">Topography</h1>
        <p className="text-lg">by Guillaume Gomez</p>
        <button className="btn btn-primary btn-lg" onClick={() => setSceneName("color-choice")} >Start to create</button>
      </animated.div>
    </div>
  );
}

export default ParallaxTilt;
