
const body = document.body;

for (let i = 0; i < numDots; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');

  // 随机生成位置
  const x = Math.random() * document.body.scrollWidth;
  const y = Math.random() * document.body.scrollHeight;

  // 随机生成初始大小
  const initialSize = Math.random() * 5 + 5; // 初始大小在5px到10px之间
  const animationSize = Math.random() * 10 + 10; // 动画变化后的大小在10px到20px之间

  // 随机生成动画延迟和持续时间
  const delay = Math.random(); // 动画延迟在0s到1s之间
  const duration = Math.random() * 2 + 1; // 动画持续时间在1s到3s之间

  dot.style.width = `${initialSize}px`;
  dot.style.height = `${initialSize}px`;
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  dot.style.animationDelay = `${delay}s`;
  dot.style.animationDuration = `${duration}s`;

  // 动态生成 keyframes 动画
  const keyframes = `
    @keyframes animateDot${i} {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(${animationSize / initialSize});
        opacity: 0.5;
      }
    }
  `;
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

  dot.style.animationName = `animateDot${i}`;

  body.appendChild(dot);
}
function goHome(){
  window.location.href = '/home';
}
function goCloud(){
  window.location.href = '/cloud';
}
function goForum(){
  window.location.href = '/forum';
}
function goCollaboration(){
    const state = window.location.pathname;
    if (state === "/collaboration"){
        $id("ProjectCloudBox").style.display = "none";
        $id("ProjectInformationBackground").style.display = "none";
    }else{
        window.location.href = "/collaboration";
    }
}


