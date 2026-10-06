// CRT overlay: screen curvature, vignette and scanlines.
//
// This used to run as a Babylon.js post-process over an empty scene, so the sampled texture was
// always Babylon's default clear colour (0.2, 0.2, 0.3) stored in an 8-bit render target. That
// constant replaces the texture fetch; the rest of the maths is unchanged, so the output is the
// same pixel for pixel.

precision highp float;

#define PI 3.1415926538

varying vec2 vUV;

uniform vec2 curvature;
uniform vec2 screenResolution;
uniform vec2 scanLineOpacity;
uniform float vignetteOpacity;
uniform float brightness;
uniform float vignetteRoundness;

// vec3(0.2, 0.2, 0.3) quantised to 8 bits, as the render target stored it.
const vec4 BASE_COLOR = vec4(51.0 / 255.0, 51.0 / 255.0, 77.0 / 255.0, 1.0);

vec2 curveRemapUV(vec2 uv)
{
    // as we near the edge of our screen apply greater distortion using a sinusoid.
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
}

vec4 scanLineIntensity(float uv, float resolution, float opacity)
{
    float intensity = sin(uv * resolution * PI * 2.0);
    intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
    return vec4(vec3(pow(intensity, opacity)), 1.0);
}

vec4 vignetteIntensity(vec2 uv, vec2 resolution, float opacity, float roundness)
{
    float intensity = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    return vec4(vec3(clamp(pow((resolution.x / roundness) * intensity, opacity), 0.0, 1.0)), 1.0);
}

void main(void)
{
    vec2 remappedUV = curveRemapUV(vec2(vUV.x, vUV.y));

    if (remappedUV.x < 0.0 || remappedUV.y < 0.0 || remappedUV.x > 1.0 || remappedUV.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    vec4 baseColor = BASE_COLOR;
    baseColor *= vignetteIntensity(remappedUV, screenResolution, vignetteOpacity, vignetteRoundness);
    baseColor *= scanLineIntensity(remappedUV.x, screenResolution.y, scanLineOpacity.x);
    baseColor *= scanLineIntensity(remappedUV.y, screenResolution.x, scanLineOpacity.y);
    baseColor *= vec4(vec3(brightness), 1.0);

    gl_FragColor = baseColor;
}
