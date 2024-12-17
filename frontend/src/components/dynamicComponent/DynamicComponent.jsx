const withDynamicComponent = (Component) => (props) => {
  return <Component {...props} />;
};

export default withDynamicComponent;
