import { useEffect, useRef, useState } from "react";

export const ShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    
    // Resize canvas to fill window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - (e.clientY / window.innerHeight)
      };
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMouseRef.current = {
          x: e.touches[0].clientX / window.innerWidth,
          y: 1.0 - (e.touches[0].clientY / window.innerHeight)
        };
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    
    // Create vertex shader
    const vertexShaderSource = `
      attribute vec4 aVertexPosition;
      void main() {
        gl_Position = aVertexPosition;
      }
    `;
    
    // Create fragment shader with interactive fluid effects
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      
      // Smooth noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      
      // Fractal Brownian Motion for organic movement
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for(int i = 0; i < 5; i++) {
          value += amplitude * snoise(p * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        vec2 p = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.x, iResolution.y);
        
        // Mouse influence
        vec2 mouseInfluence = (iMouse - 0.5) * 0.5;
        float mouseDist = length(uv - iMouse);
        float mouseEffect = smoothstep(0.5, 0.0, mouseDist);
        
        // Dynamic streak effect
        float streakTime = iTime * 0.3;
        vec2 streakPos = vec2(
          cos(streakTime * 0.5) * 0.7,
          sin(streakTime * 0.7) * 0.5
        );
        float streak = 1.0 - smoothstep(0.0, 0.3, length(p - streakPos));
        streak *= sin(streakTime * 3.0) * 0.5 + 0.5;
        
        // Flowing fluid distortion
        vec2 distortion = vec2(
          fbm(p * 2.0 + iTime * 0.1 + mouseInfluence),
          fbm(p * 2.0 - iTime * 0.15 + mouseInfluence.yx)
        );
        
        // Add mouse interactivity
        distortion += mouseEffect * vec2(
          cos(iTime * 2.0) * 0.3,
          sin(iTime * 2.0) * 0.3
        );
        
        vec2 distortedP = p + distortion * 0.3;
        
        // Create flowing color field
        float flow1 = fbm(distortedP * 1.5 + iTime * 0.08);
        float flow2 = fbm(distortedP * 2.0 - iTime * 0.06);
        float flow3 = fbm(distortedP * 1.2 + vec2(iTime * 0.05, -iTime * 0.07));
        
        // Soft, ambient colors fitting the dark theme
        vec3 color1 = vec3(0.1, 0.15, 0.2);  // Deep blue-gray
        vec3 color2 = vec3(0.15, 0.1, 0.25); // Purple-gray
        vec3 color3 = vec3(0.08, 0.12, 0.18); // Dark blue
        vec3 accentColor = vec3(0.3, 0.4, 0.6); // Soft blue accent
        
        // Mix colors organically
        vec3 finalColor = mix(color1, color2, flow1 * 0.5 + 0.5);
        finalColor = mix(finalColor, color3, flow2 * 0.5 + 0.5);
        finalColor = mix(finalColor, accentColor, flow3 * 0.3);
        
        // Add streak glow
        vec3 streakColor = vec3(0.4, 0.5, 0.7);
        finalColor += streakColor * streak * 0.4;
        
        // Add mouse glow
        finalColor += vec3(0.2, 0.3, 0.5) * mouseEffect * 0.3;
        
        // Subtle vignette
        float vignette = 1.0 - length(p) * 0.3;
        finalColor *= vignette;
        
        // Smooth fade for content overlay
        float alpha = 0.85;
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;
    
    // Create and compile vertex shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    
    // Create and compile fragment shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) return;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    
    // Check for compilation errors
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error("Fragment shader error:", gl.getShaderInfoLog(fragmentShader));
      return;
    }
    
    // Create shader program
    const shaderProgram = gl.createProgram();
    if (!shaderProgram) return;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    
    // Create a buffer for the positions
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // Full-screen quad vertices
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Get attribute location
    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Get uniform locations
    const timeUniformLocation = gl.getUniformLocation(shaderProgram, "iTime");
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "iResolution");
    const mouseUniformLocation = gl.getUniformLocation(shaderProgram, "iMouse");
    
    // Enable blending for fade effect
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // Animation loop
    let startTime = Date.now();
    let animationId: number;
    
    const render = () => {
      // Smooth mouse interpolation
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;
      
      // Set time uniform
      const currentTime = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeUniformLocation, currentTime);
      
      // Set resolution uniform
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      
      // Set mouse uniform
      gl.uniform2f(mouseUniformLocation, mouseRef.current.x, mouseRef.current.y);
      
      // Draw the full-screen quad
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      // Request next frame
      animationId = requestAnimationFrame(render);
    };
    
    render();
    setIsLoaded(true);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationId);
      gl.deleteProgram(shaderProgram);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full transition-opacity duration-1000"
      style={{ opacity: isLoaded ? 1 : 0 }}
    />
  );
};
