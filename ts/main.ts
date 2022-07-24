interface Vec2 {
  x: number;
  y: number;
}

interface Queue_Element {
  pos: Vec2;
  color: string;
}

interface Brushes {
  [key: string]: string;
}

interface State {
  queue: Queue_Element[];
  mouse_pos: Vec2;
  brush_color: string;
  res: Vec2; // For this property/variable treat (x;y) as (width;height)
  mouse_down: boolean;
}

const global_state: State = {
  queue: [],
  brush_color: "red",
  mouse_down: false,
  mouse_pos: { x: 0, y: 0 },
  res: { x: 38, y: 38 }
};

const brushes: Brushes = {
  red: "red",
  blue: "blue",
  erase: "ERASE"
};

function update_queue() {
  // NOTE(Aiden): Shouldn't really do that since these are rather 
  // heavy operations for big sets of data, you definitely wouldn't do something
  // like that in OpenGL or similar graphics API.
  // 
  // It's fine for a small toy/learning example like this.
  if (global_state.brush_color !== brushes.erase) {
    const index = global_state.queue.findIndex((element) => {
      return(element.pos.x === global_state.mouse_pos.x 
        && element.pos.y === global_state.mouse_pos.y);
    });

    if (index !== -1) { 
      global_state.queue[index].color = global_state.brush_color;
      return;
    }

    global_state.queue.push({
      pos: global_state.mouse_pos,
      color: global_state.brush_color
    });
  } else {
    global_state.queue = global_state.queue.filter((element) => { 
      return(element.pos.x !== global_state.mouse_pos.x 
        || element.pos.y !== global_state.mouse_pos.y);
    });
  }
}

function render_board(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
  function frame() {
    const colors = ["#828282", "#C5D6D8"];

    for (let i = 0; i < canvas.height / global_state.res.x; ++i) {
      for (let j = 0; j < canvas.width / global_state.res.y; ++j) {
        context.fillStyle = colors[(j + i) & 1];
        context.fillRect(global_state.res.x * j, global_state.res.y * i, global_state.res.x, global_state.res.y);
      }
    }

    for (let element of global_state.queue) {
      context.fillStyle = element.color;
      context.fillRect(element.pos.x * global_state.res.x, element.pos.y * global_state.res.y,
        global_state.res.x, global_state.res.y);
    }

    context.fillStyle = "rgba(24, 219, 89, 0.4)";
    context.fillRect(global_state.mouse_pos.x * global_state.res.x, global_state.mouse_pos.y * global_state.res.y,
      global_state.res.x, global_state.res.y);

    window.requestAnimationFrame(frame);
  }

  frame();
}

window.onload = function (): void {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  render_board(canvas, context);

  canvas.addEventListener("mousemove", function (e: MouseEvent): void {
    const bounding = this.getBoundingClientRect();

    global_state.mouse_pos = {
      x: Math.floor((e.clientX - bounding.left) / global_state.res.x),
      y: Math.floor((e.clientY - bounding.top) / global_state.res.y)
    };

    if (global_state.mouse_down) {
      update_queue();
    }
  });

  canvas.addEventListener("click", function (): void {
    update_queue();
  });

  document.addEventListener("mousedown", function (): void {
    global_state.mouse_down = true;
  });

  document.addEventListener("mouseup", function (): void {
    global_state.mouse_down = false;
  });

  document.addEventListener("keydown", function (e: KeyboardEvent) {
    switch (e.key) {
      case "1": {
        global_state.brush_color = brushes.red;
      } break;

      case "2": {
        global_state.brush_color = brushes.blue;
      } break;

      case "3": {
        global_state.brush_color = brushes.erase;
      } break;
    }
  });
}