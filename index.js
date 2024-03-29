const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let circles = [
  { x: 100, y: 75, color: "#FFFF00", clicked: false },
  { x: 100, y: 200, color: "#0000FF", clicked: false },
  { x: 100, y: 325, color: "#ff0000", clicked: false },
  { x: 100, y: 450, color: "#90EE90", clicked: false }
];

let arrows = [
  { x: 550, y: 75, targetX: 500, targetY: 75, arrowWidth: 10, color: 'black', moving: false },
  { x: 550, y: 200, targetX: 500, targetY: 200, arrowWidth: 10, color: 'black', moving: false },
  { x: 550, y: 325, targetX: 500, targetY: 325, arrowWidth: 10, color: 'black', moving: false },
  { x: 550, y: 450, targetX: 500, targetY: 450, arrowWidth: 10, color: 'black', moving: false }
];

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach(circle => {
    drawCircle(circle);
  });
}

function drawCircle(circle) {
  ctx.beginPath();
  ctx.fillStyle = circle.color;
  ctx.arc(circle.x, circle.y, 50, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}


document.getElementById('resetButton').addEventListener('click', function () {
  location.reload();
});
function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color) {
  var headlen = 10;
  var angle = Math.atan2(toy - fromy, tox - fromx);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineWidth = arrowWidth;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7),
      toy - headlen * Math.sin(angle - Math.PI / 7));

  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7),
      toy - headlen * Math.sin(angle + Math.PI / 7));

  ctx.lineTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7),
      toy - headlen * Math.sin(angle - Math.PI / 7));

  ctx.stroke();
  ctx.restore();
}


canvas.addEventListener('click', function moving(event) {
  circles.forEach((circle, index) => {
    if (Math.sqrt(Math.pow(event.offsetX - circle.x, 2) + Math.pow(event.offsetY - circle.y, 2)) <= 60) {
      arrows[index].moving = true;
      circle.clicked = true;
    }
  });
});

function checkCollision(index) {
  let arrow = arrows[index];
  circles.forEach(circle => {
    if (Math.sqrt(Math.pow(arrow.targetX - circle.x, 2) + Math.pow(arrow.targetY - circle.y, 2)) <= 60) {
      circle.color = 'black'; // Change color when collided
      arrow.moving = false; // Stop movement on collision
    }
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas at the beginning of each animation frame

  // Draw circles
  circles.forEach(circle => {
    draw();
  });

  arrows.forEach((arrow, index) => {
    if (arrow.moving) {
      checkCollision(index);
      let dx = arrow.targetX - arrow.x;
      let dy = arrow.targetY - arrow.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 1) {
        // Move arrow towards the target
        arrow.targetX-=2;
        arrow.x-=2;
      } else {
        arrow.moving = false;
        checkCollision(index);
        if (!arrow.moving) {
          // Remove arrow from the array if it collided
          arrows.splice(index, 1);
        }
        
       
      }
    }

    drawArrow(ctx, arrow.x, arrow.y, arrow.targetX, arrow.targetY, arrow.arrowWidth, arrow.color);
    

  });

  requestAnimationFrame(animate);
}

// Start the animation
animate();
