import {useProduct} from '@shopify/hydrogen/client';

const ProductOptionsSelect = (props) => {
  const {optionName, values} = props;

  const {setSelectedOption} = useProduct();

  // TODO: use controlled select
  return (
    <div className="relative">
      <select
        className="appearance-none border border-black focus:shadow-outline h-10 placeholder-gray-600 pl-3 pr-6 text-sm w-full"
        onChange={(event) => {
          const value = event.target.value;
          setSelectedOption(optionName, value);
        }}
      >
        {values.map(({value}) => {
          const id = `option-${optionName}-${value}`;
          return <option key={id}>{value}</option>;
        })}
      </select>
      <div className="absolute flex inset-y-0 items-center pointer-events-none px-2 right-0">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
            fillRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default ProductOptionsSelect;
