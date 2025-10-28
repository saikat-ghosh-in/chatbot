
// helper: show spinner for 1s, then reveal `text` char-by-char inside the message with id `msgId`
export function typeOutResponse(msgId, text, setChatMessages) {
  const initialDelay = 1000; // spinner duration
  const minCharDelay = 5; // ms
  const maxCharDelay = 15; // ms

  setTimeout(() => {
    let current = '';
    let i = 0;

    function step() {
      if (i <= text.length) {
        current = text.slice(0, i);
        setChatMessages(prev => prev.map(m => m.id === msgId ? { ...m, message: current, loading: false } : m));
        i++;
        const delay = Math.floor(Math.random() * (maxCharDelay - minCharDelay + 1)) + minCharDelay;
        setTimeout(step, delay);
      }
    }

    step();
  }, initialDelay);
}