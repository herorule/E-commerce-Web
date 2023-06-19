export default function (props) {
    const {title,type} = props
    
  return (
    <div className="shop-item">
      <label htmlFor="">{title}</label>
      <input type={type} />
    </div>
  );
}
