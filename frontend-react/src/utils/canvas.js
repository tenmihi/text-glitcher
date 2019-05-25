export function canvasToBlob (canvas) {
  const type = 'image/png';
  const dataurl = canvas.toDataURL(type);
  const bin = atob(dataurl.split(',')[1]);
  const buffer = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  return new Blob([buffer.buffer], {type: type});
}
