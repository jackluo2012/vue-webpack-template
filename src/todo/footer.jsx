import '../assets/styles/footer.styl'

export default {
    data(){
        return {
            author:"Jack"
        }
    },
    render(){
        return (
            <div id="footer">
                <span>Writter By {this.author}</span>
            </div>
        )
    }
}