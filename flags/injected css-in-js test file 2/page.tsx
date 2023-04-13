export default () => (
  <div>
    <p>only this paragraph will get the style :)</p>
		<SomeComponent />
    
		<style jsx>{`
      p {
        color: red;
      }
    `}</style>
  </div>
)