import { ImagePending, TextPending } from '../Pending'

export default function Maker() {
  return (
    <section id="quem-faz" className="band band-navy">
      <div className="band-content">
        <h2 className="h2-brand text-paper">Quem faz</h2>

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-center md:gap-12">
          <ImagePending
            label="Foto real, primeiro plano"
            width={320}
            height={320}
            tone="dark"
            className="md:!max-w-[240px]"
          />

          <div>
            <p className="h3-brand text-paper">
              <TextPending tone="dark">Nome completo</TextPending>
            </p>
            <p className="body-brand mt-1" style={{ color: 'rgba(245,247,249,0.7)' }}>
              <TextPending tone="dark">Cidade</TextPending>
            </p>
            <p
              className="body-brand measure mt-4"
              style={{ color: 'rgba(245,247,249,0.85)' }}
            >
              <TextPending tone="dark">
                uma frase sobre por que faço software para negócio pequeno
              </TextPending>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
