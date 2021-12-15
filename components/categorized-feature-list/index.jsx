import s from './style.module.css'
import Accordion from '@hashicorp/react-accordion'

export default function CategorizedFeatureList({ heading, categories }) {
  return (
    <div className={s.categorizedFeatureList}>
      <h2 className="g-type-display-2">{heading}</h2>
      <div className={s.categories}>
        {categories.map((category) => (
          <div key={category.description} className={s.category}>
            <div className={s.image}>
              <img alt="" src={category.image.url} />
            </div>
            <div className={s.content}>
              {category.title}
              <p className={s.description + ' g-type-body'}>
                {category.description}
              </p>
              <Accordion items={category.features} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
