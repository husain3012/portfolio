export const setTransform = (el: { style: { transform: string; WebkitTransform: string } }, transform: string) => {
  el.style.transform = transform;
  el.style.WebkitTransform = transform;
};

export const isVisibleTop = (
  el: { getBoundingClientRect: () => any; parentNode: { getBoundingClientRect: () => any }; offsetTop: any },
  container: { getBoundingClientRect: () => any }
) => {
  const wHeight = window.innerHeight;
  const rect = el.getBoundingClientRect();
  const parentRect = el.parentNode.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const offset = parentRect.top + el.offsetTop - containerRect.top;
  const visible = offset < wHeight && rect.bottom <= wHeight + rect.height;
  return visible;
};

export const isVisible = (start: number, end: number, yCurrent: number) => {
  const visible = start <= yCurrent && end >= yCurrent;
  return visible;
};

export const setStyles = (
  spacer: { style: { height: string; width: string; position: string } },
  container: {
    style: { position: string; left: number; top: number; zIndex: number; width: string };
    classList: { add: (arg0: string) => void };
    getBoundingClientRect: () => { (): any; new (): any; height: any };
  }
) => {
  container.style.position = "fixed";
  container.style.left = 0;
  container.style.top = 0;
  container.style.zIndex = 2;
  container.style.width = "100%";
  container.classList.add("active");

  const containerHeight = container.getBoundingClientRect().height;
  spacer.style.height = containerHeight + "px";
  spacer.style.width = "1px";
  spacer.style.position = "relative";
};

export const updateElements = (blocks: any[], yCurrent: number) => {
  blocks.forEach((b: { start: number; end: any; el: any; diffrence: number; distance: number; direction: string }) => {
    if (isVisible(b.start, b.end, yCurrent)) {
      const el = b.el;
      const progress = -((b.start - yCurrent) / b.diffrence);
      const px = progress * (b.distance / 100) * 100;
      const position = px.toFixed(2);
      if (b.direction === "x") setTransform(el, "translateX(" + position + "px)");
      else setTransform(el, "translateY(" + position + "px)");
    }
  });
};

export const createBlock = (data: { children?: any; dataDirection?: any; dataPx?: any; dataPercent?: any }, container: { getBoundingClientRect: () => any }) => {
  const el = data.children.ref.current;
  const { dataDirection, dataPx, dataPercent } = data;
  const wHeight = window.innerHeight;

  const direction = dataDirection || "y";
  const rect = el.getBoundingClientRect();
  const parentRect = el.parentNode.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const offset = parentRect.top + el.offsetTop - containerRect.top;
  const start = isVisibleTop(el, container) ? 0 : offset - wHeight;
  const distance = dataPx ? dataPx : dataPercent ? ((rect.height + wHeight) * dataPercent) / 100 : 100;
  const end = direction === "y" ? start + rect.height + wHeight + Number(distance) : start + rect.height + wHeight;
  const diffrence = end - start;

  return {
    el,
    dataPx,
    dataPercent,
    start,
    end,
    distance,
    diffrence,
    direction,
  };
};

export const reCalculateBlocks = (blocks: any[], container: { getBoundingClientRect: () => any }) => {
  return blocks.map((block: { el: any; dataPx: any; dataPercent: any; direction: any }) => {
    const el = block.el;
    const dataPx = block.dataPx;
    const dataPercent = block.dataPercent;
    const direction = block.direction;

    const wHeight = window.innerHeight;
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentNode.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const offset = parentRect.top + el.offsetTop - containerRect.top;
    const start = isVisibleTop(el, container) ? 0 : offset - wHeight;
    const distance = dataPx ? dataPx : dataPercent ? ((rect.height + wHeight) * dataPercent) / 100 : 100;
    const end = direction === "y" ? start + rect.height + wHeight + Number(distance) : start + rect.height + wHeight;
    const diffrence = end - start;

    return {
      ...block,
      start,
      end,
      distance,
      diffrence,
    };
  });
};
