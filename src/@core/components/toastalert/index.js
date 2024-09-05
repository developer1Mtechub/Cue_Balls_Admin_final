import toast, { Toaster } from 'react-hot-toast';
export default function toastAlert( type,message ) {
    if ( type == 'success' ) {
      toast.success(message,{
        style: {
          fontWeight:600,
          letterSpacing:'1px',
        },
      });
        }
        if( type == 'error' ){
      toast.error(message,{
        style: {
          fontWeight:600,
          letterSpacing:'1px',
        },
      });

          
        }
        if( type == 'info' ){
          toast(message,
              {
                icon: 'ℹ',
                style: {
                  borderRadius: '10px',
                  fontWeight:700,
                  letterSpacing:'1px',
                  background: 'blue',
                  color: '#fff',
                },
              }
            );
      }
     
        if( type == 'loading' ){
          toast(message,
              {
                // duration: 3000,
                style: {
                  borderRadius: '10px',
                  fontWeight:700,
                  letterSpacing:'1px',
                  background: 'orange',
                  color: '#fff',
                },
              }
            );
      }
   
    return (
        <div>
        <Toaster
            position="top-center"
        />
    </div>
    )
}