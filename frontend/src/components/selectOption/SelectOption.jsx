export default function SelectOption({labelClassName, selectClassName, onChange}) {
  return (
    <div>
      <label htmlFor="digitalService" className={labelClassName}>Digital service</label>
      <select name="digitalService" id="digitalService" className={selectClassName} onChange={onChange}>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>
  )
}
