/* Shared helper: the Baku skyline as one silhouette group (1600 x 900 scene, ground line at y = 760). */
AZ.skyline = function (fill) {
  var g = '';
  // Old City wall with merlons and two towers
  g += '<rect x="-20" y="724" width="640" height="38"/>';
  for (var i = 0; i < 19; i++) g += '<rect x="' + (-14 + i * 34) + '" y="712" width="20" height="12"/>';
  g += '<rect x="226" y="640" width="50" height="124"/><rect x="222" y="628" width="58" height="14"/>';
  for (var j = 0; j < 4; j++) g += '<rect x="' + (224 + j * 15) + '" y="616" width="10" height="14"/>';
  g += '<rect x="548" y="662" width="44" height="102"/><rect x="544" y="652" width="52" height="12"/>';
  // Maiden Tower (Qız Qalası)
  g += '<path d="M360 764L368 556L452 556L460 764Z"/><rect x="376" y="528" width="68" height="30"/><rect x="372" y="520" width="76" height="10"/>';
  for (var k = 0; k < 5; k++) g += '<rect x="' + (374 + k * 16) + '" y="508" width="10" height="13"/>';
  g += '<polygon points="460,596 490,650 490,764 460,764"/>';
  // houses behind
  [[620, 44], [650, 58], [690, 36], [745, 50], [775, 30]].forEach(function (b) { g += '<rect x="' + b[0] + '" y="' + (764 - b[1]) + '" width="26" height="' + b[1] + '"/>'; });
  // mosque: main dome, small dome, minaret
  g += '<path d="M600 764V716A52 52 0 0 1 704 716V764Z"/><path d="M706 764V734A22 22 0 0 1 750 734V764Z"/><rect x="618" y="650" width="6" height="22"/>';
  g += '<rect x="764" y="520" width="14" height="244"/><rect x="758" y="590" width="26" height="9"/><polygon points="764,520 771,486 778,520"/>';
  // Baku TV Tower
  g += '<rect x="880" y="372" width="8" height="392"/><ellipse cx="884" cy="560" rx="30" ry="9"/><ellipse cx="884" cy="520" rx="10" ry="24"/><rect x="883" y="330" width="2" height="44"/>';
  // Heydar Aliyev Centre: one long wave
  g += '<path d="M940 764C964 724 1012 704 1054 716C1094 728 1124 702 1166 692C1190 687 1206 706 1212 764Z"/>';
  // Flame Towers: three flames
  function flame(x, w, h, lean) {
    return '<path d="M' + x + ' 764C' + (x - 3) + ' ' + (764 - h * 0.45) + ' ' + (x + w * 0.05 + lean * 0.4) + ' ' + (764 - h * 0.78) + ' ' + (x + w * 0.5 + lean) + ' ' + (764 - h) + 'C' + (x + w * 0.96 + lean * 0.5) + ' ' + (764 - h * 0.74) + ' ' + (x + w + 3) + ' ' + (764 - h * 0.42) + ' ' + (x + w) + ' 764Z"/>';
  }
  g += flame(1232, 62, 500, 22) + flame(1316, 66, 580, -18) + flame(1404, 58, 420, 20);
  // low blocks, far right
  [[1480, 90], [1514, 54], [1546, 110], [1580, 66]].forEach(function (b) { g += '<rect x="' + b[0] + '" y="' + (764 - b[1]) + '" width="30" height="' + b[1] + '"/>'; });
  return '<g fill="' + fill + '">' + g + '</g>';
};
