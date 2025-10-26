import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState("");
  const [operation, setOperation] = useState("");
  const [sosProgress, setSosProgress] = useState(0);
  const navigate = useNavigate();
  const sosTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sosIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleNumber = async (num: string) => {
    const newDisplay = display === "0" ? num : display + num;
    setDisplay(newDisplay);
    
    // Verifica se a senha 1904 foi digitada (primeiro acesso)
    if (newDisplay === "1904") {
      setTimeout(() => {
        navigate("/profile-select");
      }, 300);
      return;
    }
    
    // Verifica se um PIN de 6 dígitos foi digitado (acesso com PIN)
    if (newDisplay.length === 6 && /^\d{6}$/.test(newDisplay)) {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { toast } = await import('sonner');
        
        // Tentar login com PIN
        const { data, error } = await supabase.rpc('login_with_pin', {
          pin_input: newDisplay
        });

        if (!error && data && data.length > 0 && data[0].success) {
          // PIN válido - fazer login
          const profileData = data[0];
          localStorage.setItem('profile_id', profileData.profile_id);
          localStorage.setItem('userProfile', profileData.user_type);
          localStorage.setItem('display_name', profileData.display_name || 'Anônima');
          
          // Feedback discreto
          setDisplay('......');
          
          setTimeout(() => {
            navigate('/app');
          }, 300);
        }
        // Se PIN inválido, não faz nada - continua como calculadora normal (discreto!)
      } catch (err) {
        // Erro silencioso - mantém disfarce
        console.error('Erro ao validar PIN:', err);
      }
    }
  };

  const handleOperation = (op: string) => {
    setPreviousValue(display);
    setDisplay("0");
    setOperation(op);
  };

  const calculate = () => {
    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "×":
        result = prev * current;
        break;
      case "÷":
        result = prev / current;
        break;
    }

    setDisplay(result.toString());
    setPreviousValue("");
    setOperation("");
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue("");
    setOperation("");
  };

  // Função: Iniciar SOS (pressionar botão =)
  const handleSOSStart = () => {
    setSosProgress(0);
    
    // Progresso visual (20% por segundo = 5 segundos)
    sosIntervalRef.current = setInterval(() => {
      setSosProgress((prev) => {
        const next = prev + 20;
        if (next >= 100) {
          clearInterval(sosIntervalRef.current!);
        }
        return next;
      });
    }, 1000);

    // Timer de 5 segundos
    sosTimerRef.current = setTimeout(() => {
      triggerSOS();
    }, 5000);
  };

  // Função: Cancelar SOS (soltar botão antes de 5s)
  const handleSOSCancel = () => {
    if (sosTimerRef.current) {
      clearTimeout(sosTimerRef.current);
      sosTimerRef.current = null;
    }
    if (sosIntervalRef.current) {
      clearInterval(sosIntervalRef.current);
      sosIntervalRef.current = null;
    }
    setSosProgress(0);
  };

  // Função: Acionar SOS de emergência (190)
  const triggerSOS = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { toast } = await import("sonner");

      // Registrar chamado de emergência
      const profileId = localStorage.getItem("profile_id");
      if (profileId) {
        await supabase.from("emergency_calls").insert([
          {
            user_id: profileId,
            phone_number: "190",
          },
        ]);
      }

      // Feedback visual
      setDisplay("SOS 190");
      toast.error("🚨 EMERGÊNCIA: Discando 190", {
        description: "Polícia Militar",
        duration: 5000,
      });

      // Discar 190
      setTimeout(() => {
        window.location.href = "tel:190";
      }, 500);
    } catch (err) {
      console.error("Erro ao acionar SOS:", err);
    } finally {
      setSosProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-zinc-800 rounded-2xl shadow-xl p-6">
        <div className="mb-6">
          <div className="text-right text-sm text-zinc-400 mb-1">
            {previousValue} {operation}
          </div>
          <div className="text-right text-4xl font-bold text-white break-all">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Button
            variant="secondary"
            className="h-16 text-lg bg-zinc-600 hover:bg-zinc-500 text-white"
            onClick={clear}
          >
            C
          </Button>
          <Button
            variant="secondary"
            className="h-16 text-lg bg-zinc-600 hover:bg-zinc-500 text-white"
            onClick={() => setDisplay(display.slice(0, -1) || "0")}
          >
            ←
          </Button>
          <Button
            variant="secondary"
            className="h-16 text-lg bg-zinc-600 hover:bg-zinc-500 text-white"
            onClick={() => handleOperation("÷")}
          >
            ÷
          </Button>
          <Button
            variant="secondary"
            className="h-16 text-lg bg-zinc-600 hover:bg-zinc-500 text-white"
            onClick={() => handleOperation("×")}
          >
            ×
          </Button>

          {["7", "8", "9"].map((num) => (
            <Button
              key={num}
              className="h-16 text-lg bg-zinc-700 hover:bg-zinc-600 text-white"
              onClick={() => handleNumber(num)}
            >
              {num}
            </Button>
          ))}
          <Button
            className="h-16 text-lg bg-zinc-600 hover:bg-zinc-500 text-white"
            onClick={() => handleOperation("-")}
          >
            -
          </Button>

          {["4", "5", "6"].map((num) => (
            <Button
              key={num}
              className="h-16 text-lg bg-zinc-700 hover:bg-zinc-600 text-white"
              onClick={() => handleNumber(num)}
            >
              {num}
            </Button>
          ))}
          <Button
            className="h-16 text-lg bg-zinc-600 hover:bg-zinc-500 text-white"
            onClick={() => handleOperation("+")}
          >
            +
          </Button>

          {["1", "2", "3"].map((num) => (
            <Button
              key={num}
              className="h-16 text-lg bg-zinc-700 hover:bg-zinc-600 text-white"
              onClick={() => handleNumber(num)}
            >
              {num}
            </Button>
          ))}
          <Button
            className="h-16 text-lg row-span-2 bg-green-600 hover:bg-green-500 text-white relative overflow-hidden"
            onClick={calculate}
            onMouseDown={handleSOSStart}
            onMouseUp={handleSOSCancel}
            onMouseLeave={handleSOSCancel}
            onTouchStart={handleSOSStart}
            onTouchEnd={handleSOSCancel}
          >
            {/* Indicador de progresso SOS */}
            {sosProgress > 0 && (
              <div
                className="absolute inset-0 bg-rose-300/60 transition-all duration-1000 ease-linear"
                style={{ width: `${sosProgress}%` }}
              />
            )}
            <span className="relative z-10">=</span>
          </Button>

          <Button
            className="h-16 text-lg col-span-2 bg-zinc-700 hover:bg-zinc-600 text-white"
            onClick={() => handleNumber("0")}
          >
            0
          </Button>
          <Button
            className="h-16 text-lg bg-zinc-700 hover:bg-zinc-600 text-white"
            onClick={() => handleNumber(".")}
          >
            .
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <Logo size="xs" className="opacity-20" />
          <p className="text-center text-xs text-zinc-500">
            v2.1
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
