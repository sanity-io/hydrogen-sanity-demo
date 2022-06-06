import {SanityModuleAccordion} from '../../types';

type Props = {
  module: SanityModuleAccordion;
};

export default function ModuleAccordion({module}: Props) {
  console.log('module', module);
  return (
    <div className="my-16 mr-auto flex flex-col items-start">Accordion</div>
  );
}
