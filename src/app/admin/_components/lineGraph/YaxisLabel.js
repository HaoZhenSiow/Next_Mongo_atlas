import { useLineChartStore } from '../../_store/lineChartStore';

export default function YaxisLabel() {
  const { dataDisplayingType, medium } = useLineChartStore()
  const { value, unit } = medium,
        displayUnit = dataDisplayingType === 'percentage' ? '%' : unit

  return (
    <>
      <line className='dime-line' x1="0" y1="0%" x2="1000" y2="0%" strokeWidth="1"/>
      <line className='dime-line' x1="0" y1="20%" x2="1000" y2="20%" strokeWidth="1"/>
      <line className='dime-line' x1="0" y1="40%" x2="1000" y2="40%" strokeWidth="1"/>
      <line className='dime-line' x1="0" y1="60%" x2="1000" y2="60%" strokeWidth="1"/>
      <line x1="0" y1="80%" x2="1000" y2="80%" strokeWidth="1"/>
      <text x="100%" y="2%" textAnchor="end" alignmentBaseline="hanging">{(value*2)+displayUnit}</text>
      <text x="100%" y="22%" textAnchor="end" alignmentBaseline="hanging">{(value/2*3)+displayUnit}</text>
      <text x="100%" y="42%" textAnchor="end" alignmentBaseline="hanging">{value+displayUnit}</text>
      <text x="100%" y="62%" textAnchor="end" alignmentBaseline="hanging">{(value/2)+displayUnit}</text>
      <text x="100%" y="82%" textAnchor="end" alignmentBaseline="hanging">0</text>
    </>
  );
}