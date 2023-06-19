export default function (props) {
    const {title, options} = props
  return (
    <div className="shop-item">
      <label htmlFor={title}>{title}</label>
      <select onChange={()=>{}}>
        {options.map(({name, _id}) => {
            return <option key={_id} value={name}>{name}</option>
        })}
      </select>
    </div>
  );
}
