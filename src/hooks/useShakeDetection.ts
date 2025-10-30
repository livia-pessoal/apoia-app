import { useEffect, useCallback, useRef } from 'react';

interface ShakeDetectionOptions {
  threshold?: number;
  timeout?: number;
}

export const useShakeDetection = (
  onShake: () => void,
  options: ShakeDetectionOptions = {}
) => {
  const { threshold = 50, timeout = 1000 } = options; // Muito mais alto!
  const lastShakeTime = useRef(0);

  const handleShake = useCallback(() => {
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    let lastUpdate = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const currentTime = new Date().getTime();
      
      // Debounce: ignorar shake se último foi há menos de 2 segundos
      if (currentTime - lastShakeTime.current < 2000) {
        return;
      }
      
      if (currentTime - lastUpdate > 100) {
        const diffTime = currentTime - lastUpdate;
        lastUpdate = currentTime;

        const x = acceleration.x ?? 0;
        const y = acceleration.y ?? 0;
        const z = acceleration.z ?? 0;

        const speed =
          (Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime) * 10000;

        if (speed > threshold) {
          lastShakeTime.current = currentTime; // Atualizar último shake
          onShake();
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      }
    };

    // Solicitar permissão no iOS 13+
    if (
      typeof (DeviceMotionEvent as any).requestPermission === 'function'
    ) {
      (DeviceMotionEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        })
        .catch(console.error);
    } else {
      // Navegadores que não precisam de permissão
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [onShake, threshold]);

  useEffect(() => {
    const cleanup = handleShake();
    return cleanup;
  }, [handleShake]);
};
