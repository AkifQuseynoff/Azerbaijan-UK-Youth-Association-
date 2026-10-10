/* The Baku skyline, drawn once, cleanly (viewBox 0 350 1600 440; the ground line is y = 764).
 *   far:    a pale, generic low-rise horizon (not a copy of the landmarks, so nothing looks doubled)
 *   near:   the landmarks in navy: Old City wall, Maiden Tower, mosque and minaret, TV tower, Heydar Aliyev Centre
 *   towers: the three Flame Towers as separate paths, so they can take the logo's blue, red and green
 * Every building runs down to y = 770 and the ground starts at y = 756, so no hairline gap can appear between them. */
R3.city = function () {
  var far = '', near = '', i;
  for (i = 0; i < 64; i++) {
    var w = 22 + ((i * 7) % 5) * 7, h = 46 + 58 * Math.abs(Math.sin(i * 0.73)) + 36 * Math.abs(Math.sin(i * 1.9 + 1));
    far += '<rect x="' + (i * 26 - 20) + '" y="' + (770 - h).toFixed(1) + '" width="' + w + '" height="' + h.toFixed(1) + '"/>';
  }
  // Old City wall with merlons and two towers
  near += '<rect x="-20" y="724" width="640" height="46"/>';
  for (i = 0; i < 19; i++) near += '<rect x="' + (-14 + i * 34) + '" y="712" width="20" height="12"/>';
  near += '<rect x="226" y="640" width="50" height="130"/><rect x="222" y="628" width="58" height="14"/>';
  for (i = 0; i < 4; i++) near += '<rect x="' + (224 + i * 15) + '" y="616" width="10" height="14"/>';
  near += '<rect x="548" y="662" width="44" height="108"/><rect x="544" y="652" width="52" height="12"/>';
  // Maiden Tower
  near += '<path d="M360 770L368 556L452 556L460 770Z"/><rect x="376" y="528" width="68" height="30"/><rect x="372" y="520" width="76" height="10"/>';
  for (i = 0; i < 5; i++) near += '<rect x="' + (374 + i * 16) + '" y="508" width="10" height="13"/>';
  near += '<polygon points="460,596 490,650 490,770 460,770"/>';
  // houses behind the mosque
  [[620, 44], [650, 58], [690, 36], [745, 50], [775, 30]].forEach(function (b) { near += '<rect x="' + b[0] + '" y="' + (770 - b[1]) + '" width="26" height="' + b[1] + '"/>'; });
  // mosque (dome, small dome) and minaret
  near += '<path d="M600 770V716A52 52 0 0 1 704 716V770Z"/><path d="M706 770V734A22 22 0 0 1 750 734V770Z"/><rect x="618" y="650" width="6" height="22"/>';
  near += '<rect x="764" y="520" width="14" height="250"/><rect x="758" y="590" width="26" height="9"/><polygon points="764,520 771,486 778,520"/>';
  // Baku TV Tower (kept below the logo ring)
  near += '<rect x="881" y="452" width="6" height="318"/><ellipse cx="884" cy="590" rx="30" ry="9"/><ellipse cx="884" cy="552" rx="10" ry="24"/><rect x="883" y="412" width="2" height="42"/>';
  // Heydar Aliyev Centre: one long wave
  near += '<path d="M940 770C964 724 1012 704 1054 716C1094 728 1124 702 1166 692C1190 687 1206 706 1212 770Z"/>';
  // low blocks, far right
  [[1480, 90], [1514, 54], [1546, 110], [1580, 66]].forEach(function (b) { near += '<rect x="' + b[0] + '" y="' + (770 - b[1]) + '" width="30" height="' + b[1] + '"/>'; });
  function flame(x, w, h, lean, cls) {
    return '<path class="' + cls + '" d="M' + x + ' 770C' + (x - 3) + ' ' + (764 - h * 0.45) + ' ' + (x + w * 0.05 + lean * 0.4) + ' ' + (764 - h * 0.78) + ' ' + (x + w * 0.5 + lean) + ' ' + (764 - h) + 'C' + (x + w * 0.96 + lean * 0.5) + ' ' + (764 - h * 0.74) + ' ' + (x + w + 3) + ' ' + (764 - h * 0.42) + ' ' + (x + w) + ' 770Z"/>';
  }
  var towers = flame(1232, 62, 300, 16, 't1') + flame(1316, 66, 350, -12, 't2') + flame(1404, 58, 255, 14, 't3');
  return { far: far, near: near, towers: towers };
};
