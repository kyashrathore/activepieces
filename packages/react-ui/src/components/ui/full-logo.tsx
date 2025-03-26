import { t } from 'i18next';


const FullLogo = () => {
  const branding = 'url'

  return (
    <div className="h-[60px]">
      <img
        className="h-full"
        src={''}
        alt={t('logo')}
      />
    </div>
  );
};
FullLogo.displayName = 'FullLogo';
export { FullLogo };
