# Raymarching_Project
My project for the course in WebGL at FMI

Requires an average GPU(runs on a GT 650M at 60fps).

Uses distance fields and ray marching for rendering.

Many of the techniques used can be found at:

"Sphere tracing: a geometric method for the antialiased raytracing of implicit surfaces" - John C. Hart

http://iquilezles.org/www/index.htm

https://www.shadertoy.com/


A few screens:

![alt tag](http://i.imgur.com/bkl8ac0.png)

![alt tag](http://i.imgur.com/Nxq0iDM.png)


Implements the following features:

Interactivity:

-W/S for forward/backward propulsion

-A/D for left/right propulsion
		
-up/down arrow for up/down rotation
		
-left/right arrow for left/right rotation
		
-space for jumping
		
-q for rendering mode iteration
		
Physics:
		
-force based movement
		
-inertia
		
-quadratic drag
		
-explicit euler integration

-gravity
		
-collisions - result in sliding
		
-moving stairs

-jumping - along the normal of the current surface
		
Graphics:
		
-raymarching based - "Sphere tracing: a geometric method for the antialiased raytracing of implicit surfaces" - John C. Hart

-rendering modes: normal, ray iteration count, AO, soft shadows

-fake ambient occlusion

-fake sub-surface scattering

-fake soft shadows

-fake sky and sun

-phong illumination model

-directional light

-chess floor

-player color depends on position

-realistic(exponential) fog simulation

Misc:

-3rd person camera

-field of view based on velocity and camera orientation

-menger sponge
