export const CREATE_MENU_BAR = (menuItems) => {
  return menuItems.map((item) => {
    return {
      name: item.name,
      sectionRef: item.sectionRef,
    };
  });
};
