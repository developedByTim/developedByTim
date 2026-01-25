import{ type Image } from "../UI/types";

export default function ImageDialog({selectedImage, setSelectedImage, handleDeleteImage}: {selectedImage: Image, setSelectedImage: (image: Image | null) => void, handleDeleteImage: (id:string) => Promise<void>}) {
 return    <div  onClick={() => setSelectedImage(null)} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded max-w-3xl w-full relative">
                        <button 
                            className="absolute top-2 right-2 text-gray-700 font-bold text-xl"
                            onClick={() => setSelectedImage(null)}
                        >
                            &times;
                        </button>
                        <img src={selectedImage.url} alt={selectedImage.fileName} className="w-full h-auto mb-4" />
                        <h3 className="text-lg font-bold">{selectedImage.fileName}</h3>
                        <p>{`ISO: ${selectedImage.filmSpeed}, Stock: ${selectedImage.filmStock}, Format: ${selectedImage.filmFormat}`}</p>
                        <p>{selectedImage.bw ? 'Black and White' : 'Color'}</p>
                    </div>
                </div>
}